from django.contrib.auth.models import (Group, Permission)
from rest_framework import (serializers)

from app.constants import SERIALIZER_ALL_FIELDS
from app.models import *


class UserAdminGeneralSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'full_name']


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


class PlatformSerializer(serializers.ModelSerializer):
    class Meta:
        model = Platform
        fields = SERIALIZER_ALL_FIELDS


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = SERIALIZER_ALL_FIELDS


class LogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Log
        fields = SERIALIZER_ALL_FIELDS


class EnumSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enum
        fields = SERIALIZER_ALL_FIELDS

"""
class OrderSerializer(serializers.ModelSerializer):
    owner = UserAdminGeneralSerializer(read_only=True)

    class Meta:
        model = Order
        fields = SERIALIZER_ALL_FIELDS
"""

class InvoiceSerializer(serializers.ModelSerializer):
    user = UserAdminGeneralSerializer(read_only=True)

    class Meta:
        model = Invoice
        fields = SERIALIZER_ALL_FIELDS


class ReviewOwnerSerializer(serializers.ModelSerializer):
    country = CountrySerializer(read_only=True)

    class Meta:
        model = User
        fields = ['country', 'full_name']

"""
class ReviewSerializer(serializers.ModelSerializer):
    owner = ReviewOwnerSerializer(read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'rate', 'text', 'review_date', 'owner']


class SheetSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SheetSetting
        fields = SERIALIZER_ALL_FIELDS
"""