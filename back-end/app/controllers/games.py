from rest_framework import generics
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from app.models import (GameCard, Game, GameKey)
from app.serializers.game import (GameCardSerializer, GameSerializer)


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
    queryset = Game.objects.all()
    serializer_class = GameSerializer


class GameFetch(generics.RetrieveAPIView):
    queryset = Game.objects.all()
    serializer_class = GameSerializer
