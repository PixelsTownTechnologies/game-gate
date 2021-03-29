from django.utils import timezone
from rest_framework import generics
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from app.models import (User, GameCard, Order, Accessory, Invoice, PointShop)
from app.permissions import (release_order_api_access, get_order_api_access)
from app.resources import (send_order_email)
from app.serializers.order import (OrderInfoSerializer)


def handle_accessory_order(user: User, quantity, accessory_id, ship_location):
    try:
        accessory_id = int(accessory_id)
        quantity = int(quantity)
    except Exception as e:
        release_order_api_access()
        return Response(status=status.HTTP_400_BAD_REQUEST)
    queryset = Accessory.objects.filter(id=accessory_id)
    if queryset is None or len(queryset) < 1:
        release_order_api_access()
        return Response(status=status.HTTP_400_BAD_REQUEST)
    accessory: Accessory = queryset[0]
    if accessory.system_quantity < quantity:
        release_order_api_access()
        return Response(status=status.HTTP_400_BAD_REQUEST)
    total_cost = quantity * accessory.total_price if not user.dealer else accessory.total_dealer_price
    total_points = quantity * accessory.points
    if user.balance < total_cost:
        release_order_api_access()
        return Response(status=status.HTTP_400_BAD_REQUEST)
    accessory.system_quantity = accessory.system_quantity - quantity
    user.balance = user.balance - total_cost
    user.points = user.points + total_points
    order = Order.objects.create(owner=user, accessory=accessory, ship_location=ship_location,
                                 quantity=quantity, cost=total_cost)
    user.save()
    accessory.save()
    Invoice.objects.create(amount=total_cost, action='P', details='New Order ' + str(order.id), user=user)
    release_order_api_access()
    return Response(status=status.HTTP_201_CREATED, data=OrderInfoSerializer(order).data)


def handle_game_card_order(user: User, game_card_id, quantity, account_id, extra_info):
    try:
        game_card_id = int(game_card_id)
        quantity = int(quantity)
    except Exception:
        release_order_api_access()
        return Response(status=status.HTTP_400_BAD_REQUEST)
    queryset = GameCard.objects.filter(id=game_card_id)
    if queryset is None or len(queryset) < 1:
        release_order_api_access()
        return Response(status=status.HTTP_400_BAD_REQUEST)
    game_card: GameCard = queryset[0]
    available_keys = game_card.keys.filter(available=True)
    total_cost = quantity * game_card.total_price if not user.dealer else game_card.total_dealer_price
    total_points = quantity * game_card.points
    if user.balance < total_cost or (available_keys.count() < quantity and game_card.game.type == 'K'):
        release_order_api_access()
        return Response(status=status.HTTP_400_BAD_REQUEST)
    user.balance = user.balance - total_cost
    user.points = user.points + total_points
    order = Order.objects.create(owner=user, game_card=game_card,
                                 state='C' if game_card.game.type == 'K' else 'I',
                                 account_id=account_id, extra_info=extra_info,
                                 compete_date=timezone.now() if game_card.game.type == 'K' else None,
                                 quantity=quantity, cost=total_cost)
    send_order_email(order)
    counter = 0
    for key in available_keys:
        counter = counter + 1
        key.available = False
        key.order = order
        key.save()
        if counter == quantity:
            break
    user.save()
    Invoice.objects.create(amount=total_cost, action='P', details='New Order ' + str(order.id), user=user).save()
    release_order_api_access()
    return Response(status=status.HTTP_201_CREATED, data=OrderInfoSerializer(order).data)


def handle_create_order(user, quantity, extra_info, account_id, ship_location, accessory_id, game_card_id) -> Response:
    get_order_api_access(user)
    if game_card_id is None and accessory_id is None:
        release_order_api_access()
        return Response(status=status.HTTP_400_BAD_REQUEST)
    if game_card_id is not None:
        return handle_game_card_order(user, game_card_id, quantity, account_id, extra_info)
    if accessory_id is not None:
        return handle_accessory_order(user, quantity, accessory_id, ship_location)
    release_order_api_access()
    return Response(status=status.HTTP_400_BAD_REQUEST)


class UserOrderFetchCreate(generics.ListCreateAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = OrderInfoSerializer

    def get_queryset(self):
        return Order.objects.filter(owner=self.request.user)

    def create(self, request, *args, **kwargs):
        data = request.data
        user: User = request.user
        if data is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        quantity = data.get('quantity', 1)
        extra_info = data.get('extra_info', '')
        account_id = data.get('account_id', '')
        ship_location = data.get('ship_location', '')
        accessory_id = data.get('accessory_id', None)
        game_card_id = data.get('game_card_id', None)
        return handle_create_order(user, quantity, extra_info, account_id, ship_location, accessory_id, game_card_id)


class UserOrderRetrieveUpdate(generics.RetrieveUpdateAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = OrderInfoSerializer

    def get_queryset(self):
        return Order.objects.filter(owner=self.request.user)


class AdminOrderFetch(generics.ListAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Order.objects.all()
    serializer_class = OrderInfoSerializer


class AdminOrderRetrieveUpdate(generics.RetrieveUpdateAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Order.objects.all()
    serializer_class = OrderInfoSerializer


class UserOrderCreatePointShop(generics.ListCreateAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = OrderInfoSerializer

    def create(self, request, *args, **kwargs):
        data = request.data
        user: User = request.user
        if data is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        account_id = data.get('account_id', '')
        point_shop_id = data.get('pointShopId', None)
        if point_shop_id is None or not str(point_shop_id).isnumeric():
            return Response(status=status.HTTP_400_BAD_REQUEST)

        point_shops = PointShop.objects.filter(id=int(point_shop_id))
        if point_shops is None or point_shops.count() < 1:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        point_shop_obj: PointShop = point_shops[0]

        if not point_shop_obj.show:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        if user.points < point_shop_obj.point_cost:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        if point_shop_obj.game_card is None:
            user.balance += point_shop_obj.money_reword
            Invoice.objects.create(amount=point_shop_obj.money_reword, action='A',
                                   details='New Balance Added From Points Shop',
                                   user=user).save()
        else:
            get_order_api_access(request.user)

            available_keys = point_shop_obj.game_card.keys.filter(available=True)
            if (available_keys.count() < point_shop_obj.quantity) \
                    and point_shop_obj.game_card.game.type == 'K':
                release_order_api_access()
                return Response(status=status.HTTP_400_BAD_REQUEST)
            order = Order.objects.create(owner=user, game_card=point_shop_obj.game_card,
                                         state='C' if point_shop_obj.game_card.game.type == 'K' else 'I',
                                         account_id=account_id, extra_info='',
                                         compete_date=timezone.now() if point_shop_obj.game_card.game.type == 'K' else None,
                                         quantity=point_shop_obj.quantity, cost=0)
            send_order_email(order)
            order.save()
            counter = 0
            for key in available_keys:
                counter = counter + 1
                key.available = False
                key.order = order
                key.save()
                if counter == point_shop_obj.quantity:
                    break
            user.points -= point_shop_obj.point_cost
            user.save()

            release_order_api_access()
            return Response(status=status.HTTP_201_CREATED, data=OrderInfoSerializer(order).data)
        user.points -= point_shop_obj.point_cost
        user.save()
        return Response(status=status.HTTP_201_CREATED, data={})


class UserOrderCreateMulti(generics.CreateAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = OrderInfoSerializer

    def get_queryset(self):
        return Order.objects.filter(owner=self.request.user)

    def create(self, request, *args, **kwargs):
        get_order_api_access(request.user)
        user: User = request.user
        list_of_orders = request.data
        status_list = []
        for order_data in list_of_orders:
            order_type = order_data.get('type', None)
            quantity = order_data.get('quantity', 1)
            account_id = order_data.get('account_id', '')
            game_card_id = order_data.get('objectId', None) if order_type == 'game' else None
            ship_location = order_data.get('ship_location', '')
            accessory_id = order_data.get('objectId', None) if order_type != 'game' else None
            if order_type is not None:
                response = handle_create_order(user, quantity, '', account_id, ship_location, accessory_id,
                                               game_card_id)
                status_list.append(response.status_code)
            else:
                status_list.append(400)
        return Response(status=status.HTTP_201_CREATED, data=status_list)
