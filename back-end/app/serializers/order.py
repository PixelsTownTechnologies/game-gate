from rest_framework import (serializers)

from app.models import (User, Order, GameKey)


class GameKeySerializer(serializers.ModelSerializer):
    class Meta:
        model = GameKey
        fields = [
            'id', 'order', 'game_card',
            'description', 'available'
        ]


class UserOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']


class OrderInfoSerializer(serializers.ModelSerializer):
    owner = UserOrderSerializer(required=False)
    order_keys = GameKeySerializer(many=True, required=False)

    class Meta:
        model = Order
        fields = [
            'id', 'owner', 'game_card', 'create', 'account_id',
            'extra_info', 'compete_date', 'review_date', 'order_keys',
            'review_star', 'review_description', 'quantity',
            'state', 'error_msg', 'is_deletable', 'is_editable',
        ]


class ReviewSerializer(serializers.ModelSerializer):
    owner = UserOrderSerializer(required=False)
    order_keys = GameKeySerializer(many=True, required=False)

    class Meta:
        model = Order
        fields = [
            'id', 'owner', 'game_card', 'compete_date', 'review_date',
            'review_star', 'review_description'
        ]