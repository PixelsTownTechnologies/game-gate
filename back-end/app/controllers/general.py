from rest_framework import generics
from rest_framework import generics
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from app.models import (Country, Invoice, User, Enum)
from app.resources import (create_notification)
from app.serializers.general import (CountrySerializer)
from app.serializers.general import (InvoiceSerializer, EnumSerializer)


class CountryListView(generics.ListAPIView):
    queryset = Country.objects.all()
    serializer_class = CountrySerializer


class CreateCountryView(generics.CreateAPIView):
    queryset = Country.objects.all()
    serializer_class = CountrySerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


"""
class OrderUserUpdate(generics.RetrieveUpdateDestroyAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def get_queryset(self):
        return Order.objects.filter(owner=self.request.user)

    def update(self, request, *args, **kwargs):
        order_id = kwargs.get('pk', None)
        if order_id is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        order = Order.objects.filter(pk=order_id, owner=self.request.user).first()
        order.email = request.data.get('email', order.email)
        order.password = request.data.get('password', order.password)
        order.backup_code = request.data.get('backup_code', order.backup_code)
        order.status = 'I'
        order.warning_msg = ''
        platform = Platform.objects.filter(name=order.platform).first()
        send_order_email(order)
        order.save()
        return Response(OrderSerializer(order).data)


class OrderUserReview(generics.RetrieveUpdateDestroyAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def get_queryset(self):
        return Order.objects.filter(owner=self.request.user)

    def update(self, request, *args, **kwargs):
        order_id = kwargs.get('pk', None)
        if order_id is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        order = Order.objects.filter(pk=order_id, owner=self.request.user).first()
        order.rate = request.data.get('rate', order.rate)
        order.text = request.data.get('text', order.text)
        order.review_date = timezone.now()
        order.save()
        return Response(OrderSerializer(order).data)


class OrderUserFetchCreate(generics.ListCreateAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def get_queryset(self):
        return Order.objects.filter(owner=self.request.user)

    def create(self, request, *args, **kwargs):
        owner = self.request.user
        platform_id = request.data.get('platform', None)
        quantity = request.data.get('quantity', None)
        password = request.data.get('password', None)
        email = request.data.get('email', None)
        backup_code = request.data.get('backup_code', None)
        invite_code = request.data.get('invite_code', None)
        if quantity is None or password is None or email is None or platform_id is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        platform = Platform.objects.filter(name=platform_id).first()
        total_cost = platform.price * quantity / platform.coins
        order = Order.objects.create(quantity=quantity, status='I', backup_code=backup_code,
                                     owner=owner, email=email, platform=platform.name,
                                     password=password, price=total_cost)
        invite_user = None
        return Response({'order': OrderSerializer(order).data,
                         'price': order.price,
                         'original_price': total_cost
                         }, status=status.HTTP_201_CREATED)


class OrderAdminFetchCreate(generics.ListCreateAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Order.objects.all()
    serializer_class = OrderSerializer


class OrderAdminUpdate(generics.RetrieveUpdateDestroyAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def update(self, request, *args, **kwargs):
        order_id = kwargs.get('pk', None)
        if order_id is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        order = Order.objects.filter(id=order_id)[0]
        order.email = request.data.get('email', order.email)
        order.password = request.data.get('password', order.password)
        order.backup_code = request.data.get('backup_code', order.backup_code)
        order.warning_msg = request.data.get('warning_msg', order.warning_msg)
        status_value = request.data.get('status', order.status)
        platform = Platform.objects.filter(name=order.platform).first()
        if order.status != status_value:
            if status_value == 'F' or status_value == 'C':
                send_phone_message(request.user.phone,
                                   request.user.zip_code,
                                   'Your Order {} Was Canceled'.format(readable_id(order.id)))
                for platform in Platform.objects.all():
                    if platform.name.lower() == order.platform.lower():
                        platform.total_coins = platform.total_coins + order.quantity
                        platform.save()
                order.owner.balance = order.owner.balance + order.price
                order.owner.save()
                send_order_email(order)
            if (order.status in ['F', 'C']) and (status_value in ['I', 'W', 'D']):
                if status_value == 'W':
                    send_phone_message(request.user.phone,
                                       request.user.zip_code,
                                       'Your Order {} Have warning data, Please edit it'.format(readable_id(order.id)))
                for platform in Platform.objects.all():
                    if platform.name.lower() == order.platform.lower():
                        platform.total_coins = platform.total_coins - order.quantity
                        platform.save()
                order.owner.balance = order.owner.balance - order.price
                order.owner.save()
                send_order_email(order)
            order.status = status_value
        order.save()
        return Response(OrderSerializer(order).data)

"""


class InvoiceUserFetchCreate(generics.ListAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer

    def get_queryset(self):
        return Invoice.objects.filter(user=self.request.user)


class InvoiceAdminFetchCreate(generics.ListCreateAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer

    def create(self, request, *args, **kwargs):
        user = User.objects.filter(pk=int(request.data['user'])).first()
        amount = float(request.data['amount'])
        invoice = Invoice.objects.create(amount=amount, user=user,
                                         action=request.data['action'], details=request.data.get('details', ''))
        if request.data['action'] == 'A':
            user.balance += amount
            create_notification(user, 'New Balance +{} Has Been Added'.format(amount))
        if request.data['action'] == 'R':
            user.balance -= amount
            create_notification(user, 'New Balance -{} Has Been Removed'.format(amount))
        if request.data['action'] == 'S':
            user.balance = amount
            create_notification(user, 'Your Balance Has Been Set to {}'.format(amount))
        user.save()
        return Response(InvoiceSerializer(invoice).data, status=status.HTTP_201_CREATED)


class EnumFetch(generics.ListAPIView):
    queryset = Enum.objects.all()
    serializer_class = EnumSerializer


class EnumUpdate(generics.UpdateAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Enum.objects.all()
    serializer_class = EnumSerializer


@api_view(['GET'])
def home(request):
    return Response(status=status.HTTP_200_OK,
                    data={'enums': EnumSerializer(Enum.objects.filter(global_enum=True), many=True).data})
