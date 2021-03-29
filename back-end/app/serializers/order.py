from rest_framework import (serializers)

from app.models import (User, Order, GameKey, GameCard, Game, Accessory)


class UserOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'address_one', 'phone', 'email']


class ReviewSerializer(serializers.ModelSerializer):
    owner = UserOrderSerializer(required=False)

    class Meta:
        model = Order
        fields = [
            'id', 'owner', 'review_date',
            'review_star', 'review_description', 'hide_review'
        ]


class SimpleGameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = ['id', 'type', 'name', 'logo', 'card_name']


class SimpleGameCardSerializer(serializers.ModelSerializer):
    game = SimpleGameSerializer(required=True)

    class Meta:
        model = GameCard
        fields = [
            'id', 'game', 'name'
        ]


class GameKeySerializer(serializers.ModelSerializer):
    class Meta:
        model = GameKey
        fields = [
            'id', 'order', 'game_card',
            'description', 'available'
        ]


class SimpleAccessorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Accessory
        fields = [
            'id', 'name', 'logo'
        ]


class OrderInfoSerializer(serializers.ModelSerializer):
    owner = UserOrderSerializer(required=False)
    order_keys = GameKeySerializer(many=True, required=False)
    review_date = serializers.DateTimeField(input_formats=['%m/%d/%Y', ], required=False)
    game_card = SimpleGameCardSerializer(required=False)
    accessory = SimpleAccessorySerializer(required=False)

    class Meta:
        model = Order
        fields = [
            'id', 'owner', 'game_card', 'create', 'account_id', 'accessory',
            'extra_info', 'compete_date', 'review_date', 'order_keys',
            'review_star', 'review_description', 'quantity', 'cost', 'hide_review',
            'state', 'error_msg', 'is_deletable', 'is_editable', 'ship_location'
        ]
