from django.utils import timezone
from rest_framework import generics
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from app.models import (User, GameCard, Order)
from app.permissions import (release_order_api_access, get_order_api_access)
from app.serializers.order import (OrderInfoSerializer)


class UserOrderFetchCreate(generics.ListCreateAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = OrderInfoSerializer

    def get_queryset(self):
        Order.objects.filter(owner=self.request.user)

    def create(self, request, *args, **kwargs):
        try:
            get_order_api_access(request.user)
            data = request.data
            user: User = request.user
            if data is None:
                release_order_api_access()
                return Response(status=status.HTTP_400_BAD_REQUEST)
            quantity = data.get('quantity', 1)
            extra_info = data.get('extra_info', '')
            account_id = data.get('account_id', '')
            game_card_id = data.get('game_card_id', None)
            if game_card_id is None:
                release_order_api_access()
                return Response(status=status.HTTP_400_BAD_REQUEST)
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
            total_cost = quantity * game_card.total_price
            if user.balance < total_cost or (available_keys.count() < quantity and game_card.game.type == 'K'):
                release_order_api_access()
                return Response(status=status.HTTP_400_BAD_REQUEST)
            user.balance = user.balance - total_cost
            order = Order.objects.create(owner=user, game_card=game_card,
                                         state='C' if game_card.game.type == 'K' else 'I',
                                         account_id=account_id, extra_info=extra_info,
                                         compete_date=timezone.now() if game_card.game.type == 'K' else None,
                                         quantity=quantity)
            counter = 0
            for key in available_keys:
                counter = counter + 1
                key.available = False
                key.order = order
                key.save()
                if counter == quantity:
                    break
            user.save()
            release_order_api_access()
            return Response(status=status.HTTP_201_CREATED, data=OrderInfoSerializer(order).data)
        except Exception:
            release_order_api_access()
            return Response(status=status.HTTP_400_BAD_REQUEST)


class UserOrderRetrieveUpdate(generics.RetrieveUpdateAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = OrderInfoSerializer

    def get_queryset(self):
        Order.objects.filter(owner=self.request.user)


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
