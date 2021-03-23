from django.contrib.auth.models import (Group, Permission)
from rest_framework import (serializers)

from app.constants import SERIALIZER_ALL_FIELDS, GENERAL_SERIALIZER_FIELDS
from app.models import *
from app.serializers.game import SimpleGameCardSerializer


class UserAdminGeneralSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'username']


class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = SERIALIZER_ALL_FIELDS


class GroupSerializer(serializers.ModelSerializer):
    permissions = PermissionSerializer(read_only=True, many=True)

    class Meta:
        model = Group
        fields = SERIALIZER_ALL_FIELDS


class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        fields = ['id', 'name', 'flag', 'band', 'zip_code']
        model = Country


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = SERIALIZER_ALL_FIELDS


class LogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Log
        fields = SERIALIZER_ALL_FIELDS


class AdsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ads
        fields = [
            'id', 'is_deletable', 'is_editable', 'name', 'show'
            , 'cover', 'external_link', 'forward_id'
            , 'type']


class EnumSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enum
        fields = [*GENERAL_SERIALIZER_FIELDS, 'id', 'name', 'data', 'type', 'values', 'max_value']


class FilesSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = [*GENERAL_SERIALIZER_FIELDS, 'id', 'name', 'file']


class InvoiceSerializer(serializers.ModelSerializer):
    user = UserAdminGeneralSerializer(read_only=True)

    class Meta:
        model = Invoice
        fields = [*GENERAL_SERIALIZER_FIELDS, 'id', 'action', 'amount', 'details', 'user', 'create_at']


class ReviewOwnerSerializer(serializers.ModelSerializer):
    country = CountrySerializer(read_only=True)

    class Meta:
        model = User
        fields = ['country', 'full_name']


class PointShopSerializer(serializers.ModelSerializer):
    game_card = SimpleGameCardSerializer(required=False)

    class Meta:
        model = PointShop
        fields = ['id', 'point_cost', 'game_card', 'money_reword', 'name', 'quantity', 'show', 'is_editable',
                  'is_deletable']

    def create(self, validated_data):
        game_card_id = self.initial_data.get('game_card', None)
        game_card_id = int(game_card_id) if game_card_id is not None and game_card_id.isnumeric() else None
        point_shop_created = PointShop.objects.create(**validated_data)
        from app.models import GameCard
        if game_card_id is not None:
            game_cards = GameCard.objects.filter(id=game_card_id)
            if game_cards.count() > 0:
                point_shop_created.game_card = game_cards[0]
        point_shop_created.save()
        return point_shop_created

    def update(self, instance, validated_data):
        game_card_id = self.initial_data.get('game_card', None)
        game_card_id = int(game_card_id) if game_card_id is not None and game_card_id.isnumeric() else None
        instance.point_cost = validated_data.get('point_cost', instance.point_cost)
        instance.money_reword = validated_data.get('money_reword', instance.money_reword)
        instance.name = validated_data.get('name', instance.name)
        instance.quantity = validated_data.get('quantity', instance.quantity)
        if game_card_id is not None:
            from app.models import GameCard
            game_cards = GameCard.objects.filter(id=game_card_id)
            if game_cards.count() > 0:
                instance.game_card = game_cards[0]
        else:
            instance.game_card = None
        instance.save()
        return instance
