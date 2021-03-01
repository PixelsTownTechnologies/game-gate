from rest_framework import (serializers)

from app.models import (Game, GameCard)


class GameCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameCard
        fields = [
            'id', 'name', 'show', 'price', 'discount', 'max', 'game', 'total_price',
            'min', 'points', 'sold_flag', 'available_keys', 'available',
            'order_min', 'order_max', 'is_sold', 'is_deletable', 'is_editable'
        ]


class GameSerializer(serializers.ModelSerializer):
    game_cards = GameCardSerializer(many=True, read_only=True, required=False)

    class Meta:
        model = Game
        fields = [
            'id', 'name', 'show', 'game_type', 'type',
            'platform', 'notes', 'about', 'details', 'video', 'bg_card',
            'facebook', 'website', 'youtube', 'logo', 'bg_cover', 'country',
            'is_deletable', 'is_editable', 'game_cards', 'card_name'
        ]
