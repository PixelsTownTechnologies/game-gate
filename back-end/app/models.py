import uuid

from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin
from django.db import models
from django.utils.translation import ugettext_lazy as _

from app.resources import get_random_string
from .managers import UserManager


class Country(models.Model):
    name = models.CharField(max_length=64)
    flag = models.CharField(max_length=5, blank=True, null=True)
    zip_code = models.CharField(max_length=10, default='', blank=True, null=True)
    band = models.BooleanField(default=False, blank=True)

    def __str__(self):
        return self.name if self.name is not None else 'Name Not Set'


class User(AbstractBaseUser, PermissionsMixin):
    uuid = models.UUIDField(default=uuid.uuid4, editable=False)
    email = models.EmailField(_('email address'), unique=True, blank=True, null=True)
    username = models.CharField(max_length=64, editable=False, blank=True)
    first_name = models.CharField(_('first name'), max_length=64, blank=True, null=True)
    last_name = models.CharField(_('last name'), max_length=64, blank=True, null=True)
    date_joined = models.DateTimeField(_('date joined'), auto_now_add=True)
    is_active = models.BooleanField(_('active'), default=True)
    is_staff = models.BooleanField(_('staff'), default=True)
    phone = models.CharField(max_length=32, blank=True, null=True)
    country = models.ForeignKey(Country, on_delete=models.DO_NOTHING, related_name='users', blank=True,
                                null=True)
    register_date = models.DateField(auto_now_add=True)
    city = models.CharField(max_length=64, blank=True, null=True)
    address_one = models.CharField(max_length=128, blank=True, null=True)
    address_two = models.CharField(max_length=128, blank=True, null=True)
    state = models.CharField(max_length=64, blank=True, null=True)
    zip_code = models.CharField(max_length=16, blank=True, null=True)
    avatar = models.ImageField(upload_to='images/avatar', blank=True, null=True)
    verified = models.BooleanField(default=False, blank=True, null=True)
    closed = models.BooleanField(default=False, blank=True, null=True)
    balance = models.FloatField(default=0, blank=True, null=True)
    verify_file = models.FileField(upload_to='verify/files', blank=True, null=True)
    code = models.CharField(max_length=12, blank=True, null=True)
    is_reset_code = models.BooleanField(default=False, blank=True, null=True)

    objects = UserManager()
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')

    @property
    def full_name(self):
        full_name = '%s %s' % (self.first_name if self.first_name is not None else '',
                               self.last_name if self.last_name is not None else '')
        return full_name.strip()

    def __str__(self):
        return self.email if self.email is not None else 'Email Not Set'


class Notification(models.Model):
    create_at = models.DateTimeField(auto_now_add=True)
    update_at = models.DateTimeField(auto_now=True, blank=True, null=True)
    title = models.CharField(max_length=128)
    user = models.ForeignKey(User, related_name='notifications', on_delete=models.CASCADE)

    def __str__(self):
        return self.title if self.title is not None else 'Title Not Set'


class Log(models.Model):
    create_at = models.DateTimeField(auto_now_add=True)
    update_at = models.DateTimeField(auto_now=True, blank=True, null=True)
    action = models.CharField(max_length=128)
    info = models.CharField(max_length=255)
    data = models.TextField(null=True, blank=True)
    user = models.ForeignKey(User, related_name='logs', on_delete=models.CASCADE)

    def __str__(self):
        return self.action if self.action is not None else 'Action Not Set'


class Enum(models.Model):
    create_at = models.DateTimeField(auto_now_add=True)
    update_at = models.DateTimeField(auto_now=True, blank=True, null=True)
    name = models.CharField(max_length=32)
    data = models.TextField(null=True, blank=True)
    values = models.TextField(null=True, blank=True)
    max_value = models.IntegerField(default=100, null=True, blank=True)
    type = models.CharField(max_length=32, default='text')
    global_enum = models.BooleanField(default=False, null=True, blank=True)

    def __str__(self):
        return self.name if self.name is not None else 'Name Not Set'


class Platform(models.Model):
    create_at = models.DateTimeField(auto_now_add=True)
    update_at = models.DateTimeField(auto_now=True, blank=True, null=True)
    name = models.CharField(max_length=64, blank=True, null=True)
    coins = models.IntegerField(default=0, blank=True, null=True)
    price = models.FloatField(default=0.0, blank=True, null=True)
    max_value = models.IntegerField(default=0, blank=True, null=True)
    min_value = models.IntegerField(default=0, blank=True, null=True)
    total_coins = models.BigIntegerField(default=0, blank=True, null=True)
    email = models.BooleanField(default=False, blank=True, null=True)


class Order(models.Model):
    STATUS_CHOICES = (
        ('D', 'Delivery'),
        ('I', 'In Progress'),
        ('C', 'Canceled'),
        ('F', 'Failed'),
        ('W', 'Warning'),
    )
    platform = models.CharField(max_length=64, null=True, blank=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    quantity = models.IntegerField(default=0, null=True, blank=True)
    status = models.CharField(max_length=1, default='I', choices=STATUS_CHOICES, null=True, blank=True)
    price = models.FloatField(default=0, null=True, blank=True)
    backup_code = models.CharField(max_length=255, null=True, blank=True)
    email = models.EmailField(default='', null=True, blank=True)
    password = models.CharField(max_length=255, default='', null=True, blank=True)
    link = models.URLField(max_length=700, null=True, blank=True)
    warning_msg = models.CharField(max_length=255, default='', null=True, blank=True)
    create_at = models.DateTimeField(auto_now_add=True)
    update_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    rate = models.IntegerField(default=0, null=True, blank=True)
    text = models.TextField(null=True, blank=True)
    review_date = models.DateTimeField(null=True, blank=True)


class Invoice(models.Model):
    ACTIONS_CHOICES = (
        ('A', 'Add Balance'),
        ('R', 'Remove Balance'),
        ('P', 'Pay'),
    )
    action = models.CharField(max_length=1, default='A', choices=ACTIONS_CHOICES, null=True, blank=True)
    amount = models.FloatField(default=0, null=True, blank=True)
    details = models.CharField(max_length=254, default='', null=True, blank=True)
    user = models.ForeignKey(User, related_name='invoices', on_delete=models.CASCADE)
    create_at = models.DateTimeField(auto_now_add=True)


class SheetSetting(models.Model):
    name = models.CharField(max_length=128, blank=True, null=True)
    fields_setting = models.TextField(blank=True, null=True)
    status_setting = models.TextField(blank=True, null=True)
    active = models.BooleanField(default=False, blank=True, null=True)
    increment = models.IntegerField(default=0, blank=True, null=True)
