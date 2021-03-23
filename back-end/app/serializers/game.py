from rest_framework import (serializers)

from app.models import (Game, GameCard, Accessory, EmbedGame)
from app.serializers.order import ReviewSerializer


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
    game_orders = ReviewSerializer(many=True, required=False)

    class Meta:
        model = Game
        fields = [
            'id', 'name', 'show', 'total_reviews', 'game_type', 'type',
            'platform', 'notes', 'about', 'details', 'video', 'bg_card', 'review_stars',
            'facebook', 'website', 'youtube', 'logo', 'bg_cover', 'country', 'game_orders',
            'is_deletable', 'is_editable', 'game_cards', 'card_name', 'total_orders'
        ]


class AccessorySerializer(serializers.ModelSerializer):
    accessory_orders = ReviewSerializer(many=True, required=False)

    class Meta:
        model = Accessory
        fields = [
            'id', 'name', 'price', 'total_reviews', 'type', 'max', 'min', 'review_stars',
            'order_min', 'discount', 'points', 'system_quantity', 'accessory_orders',
            'order_max', 'show', 'sold_flag', 'details', 'video', 'total_orders'
            , 'logo', 'image1', 'image2', 'is_sold', 'total_price', 'short_description'
            , 'image3', 'image4', 'is_deletable', 'is_editable'
        ]


class EmbedGameSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmbedGame
        fields = [
            'id', 'name', 'src', 'type',
            'details', 'video', 'logo',
            'is_deletable', 'is_editable'
        ]


class SimpleGameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = [
            'id', 'logo', 'bg_card', 'game_cards', 'card_name'
        ]


class SimpleGameCardSerializer(serializers.ModelSerializer):
    game = SimpleGameSerializer()

    class Meta:
        model = GameCard
        fields = [
            'id', 'name', 'game'
        ]
