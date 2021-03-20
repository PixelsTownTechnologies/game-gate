from django.contrib.auth.models import (Group)
from rest_framework import serializers

from app.constants import GENERAL_SERIALIZER_FIELDS
from app.models import (User)
from app.resources import (get_enum_value, create_notification)
from app.serializers.general import (PermissionSerializer, GroupSerializer, CountrySerializer, NotificationSerializer)

GENERAL_USER_FIELDS = ['id', 'avatar', 'verified', 'full_name',
                       'first_name', 'last_name', 'zip_code']

CONTACT_INFO_USER_FIELDS = ['city', 'address_one', 'phone',
                            'address_two', 'state', 'zip_code', 'email', 'verify_file']

PRIVATE_USER_FIELDS = ['uuid', 'is_active', 'balance', 'total_orders', 'points',
                       'groups', 'permissions', 'username', 'register_date', 'notifications']


class UserGeneralSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [*GENERAL_USER_FIELDS]


class UserMessageBoxSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'full_name', 'share_code_offer']


class UserSerializer(serializers.ModelSerializer):
    groups = GroupSerializer(read_only=True, required=False, many=True)
    permissions = PermissionSerializer(read_only=True, required=False, many=True)
    notifications = NotificationSerializer(read_only=True, many=True)
    country = CountrySerializer(read_only=True)

    class Meta:
        model = User
        fields = [*GENERAL_SERIALIZER_FIELDS, *GENERAL_USER_FIELDS, *CONTACT_INFO_USER_FIELDS,
                  *PRIVATE_USER_FIELDS, 'password', 'country']
        extra_kwargs = {
            'password': {'write_only': True, 'required': False},
            'email': {'required': False},
        }

    def create(self, validated_data):
        reward_point_enum = get_enum_value('New User Reward Point')
        new_user_reward_point = int(reward_point_enum) if reward_point_enum is not None else 1000
        reward_balance_enum = get_enum_value('New User Reward Balance')
        new_user_balance_point = int(reward_balance_enum) if reward_balance_enum is not None else 0
        user = User.objects.create_user(**validated_data)
        user.points = new_user_reward_point
        user.balance = new_user_balance_point
        user.groups.add(Group.objects.get(name='User'))
        user.save()
        create_notification(user, 'Welcome In Coins Gate')
        return user

    def update(self, instance: User, validated_data):
        instance.username = validated_data.get('username', instance.username)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.email = validated_data.get('email', instance.email)
        instance.zip_code = validated_data.get('zip_code', instance.zip_code)
        instance.address_one = validated_data.get('address_one', instance.address_one)
        instance.address_two = validated_data.get('address_two', instance.address_two)
        instance.city = validated_data.get('city', instance.city)
        instance.phone = validated_data.get('phone', instance.phone)
        instance.save()
        return instance


class UserAdminSerializer(serializers.ModelSerializer):
    groups = GroupSerializer(read_only=True, required=False, many=True)
    country = CountrySerializer(required=False)

    class Meta:
        model = User
        fields = [*GENERAL_SERIALIZER_FIELDS, *GENERAL_USER_FIELDS,
                  *CONTACT_INFO_USER_FIELDS, 'username', 'groups', 'balance', 'country', 'total_orders', 'points']
        extra_kwargs = {
            'email': {'required': False},
        }

    def create(self, validated_data):
        reward_point_enum = get_enum_value('New User Reward Point')
        new_user_reward_point = int(reward_point_enum) if reward_point_enum is not None else 1000
        reward_balance_enum = get_enum_value('New User Reward Balance')
        new_user_balance_point = int(reward_balance_enum) if reward_balance_enum is not None else 0
        user = User.objects.create_user(**validated_data)
        user.points = new_user_reward_point
        user.balance = new_user_balance_point
        user.groups.add(Group.objects.get(name='User'))
        user.save()
        create_notification(user, 'Welcome In Coins Gate')
        return user

    def update(self, instance: User, validated_data):
        instance.username = validated_data.get('username', instance.username)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.zip_code = validated_data.get('zip_code', instance.zip_code)
        instance.address_one = validated_data.get('address_one', instance.address_one)
        instance.address_two = validated_data.get('address_two', instance.address_two)
        instance.city = validated_data.get('city', instance.city)
        instance.phone = validated_data.get('phone', instance.phone)
        instance.points = validated_data.get('points', instance.points)
        instance.save()
        return instance
