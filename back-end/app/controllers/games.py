from rest_framework import generics
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from app.models import (GameCard, Game, GameKey, Accessory, EmbedGame)
from app.serializers.game import (GameCardSerializer, GameSerializer, AccessorySerializer, EmbedGameSerializer)


class GameCardFetchCreate(generics.ListCreateAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = GameCard.objects.all()
    serializer_class = GameCardSerializer


class GameCardUpdateDelete(generics.RetrieveUpdateDestroyAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = GameCard.objects.all()
    serializer_class = GameCardSerializer


class GameCardAddKeys(generics.CreateAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        game_card_id = request.data.get('game_card_id', None)
        keys = request.data.get('keys', None)
        if game_card_id is None or keys is None:
            Response(status=status.HTTP_400_BAD_REQUEST)
        game_card_id = int(game_card_id)
        game_card = GameCard.objects.filter(id=game_card_id)[0]
        for key in keys:
            GameKey.objects.create(description=key, available=True, game_card=game_card).save()
        return Response(status=status.HTTP_200_OK, data={'total_added': len(keys)})


class GameFetchCreate(generics.ListCreateAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Game.objects.all()
    serializer_class = GameSerializer


class GameUpdateDelete(generics.RetrieveUpdateDestroyAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Game.objects.all()
    serializer_class = GameSerializer


class GameFetchAll(generics.ListAPIView):
    queryset = Game.objects.filter(show=True)
    serializer_class = GameSerializer


class GameFetch(generics.RetrieveAPIView):
    queryset = Game.objects.filter(show=True)
    serializer_class = GameSerializer


class AccessoryFetchCreate(generics.ListCreateAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Accessory.objects.all()
    serializer_class = AccessorySerializer


class AccessoryUpdateDelete(generics.RetrieveUpdateDestroyAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Accessory.objects.all()
    serializer_class = AccessorySerializer


class AccessoryFetchAll(generics.ListAPIView):
    queryset = Accessory.objects.filter(show=True)
    serializer_class = AccessorySerializer


class AccessoryFetch(generics.RetrieveAPIView):
    queryset = Accessory.objects.filter(show=True)
    serializer_class = AccessorySerializer


class EmbedGameFetchCreate(generics.ListCreateAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = EmbedGame.objects.all()
    serializer_class = EmbedGameSerializer


class EmbedGameUpdateDelete(generics.RetrieveUpdateDestroyAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = EmbedGame.objects.all()
    serializer_class = EmbedGameSerializer


class EmbedGameFetchAll(generics.ListAPIView):
    queryset = EmbedGame.objects.all()
    serializer_class = EmbedGameSerializer


class EmbedGameFetch(generics.RetrieveAPIView):
    queryset = EmbedGame.objects.all()
    serializer_class = EmbedGameSerializer
