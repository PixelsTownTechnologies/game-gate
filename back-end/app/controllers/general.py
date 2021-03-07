from rest_framework import generics
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from app.models import (Country, Invoice, User, Enum, File, Game, GameCard)
from app.resources import (create_notification)
from app.serializers.general import (CountrySerializer)
from app.serializers.game import (GameCardSerializer, GameSerializer)
from app.serializers.general import (InvoiceSerializer, EnumSerializer, FilesSerializer)


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


class FileCreateFetch(generics.ListCreateAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = File.objects.all()
    serializer_class = FilesSerializer


class FileRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = File.objects.all()
    serializer_class = FilesSerializer


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
                    data={
                        'enums': EnumSerializer(Enum.objects.filter(global_enum=True), many=True).data,
                        'games': GameSerializer(Game.objects.filter(show=True), many=True).data,
                        'gameCards': GameCardSerializer(GameCard.objects.filter(show=True, game__show=True), many=True).data
                          })
