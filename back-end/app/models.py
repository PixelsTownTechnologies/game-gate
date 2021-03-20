import random
import uuid

from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin
from django.db import models
from django.utils.translation import ugettext_lazy as _

from .managers import UserManager


def generate_user_name():
    return 'User {}'.format(random.randint(111111, 999999))


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
    username = models.CharField(max_length=64, blank=True, default=generate_user_name)
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
    points = models.IntegerField(default=0, blank=True, null=True)

    objects = UserManager()
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')

    @property
    def is_deletable(self):
        return False

    @property
    def total_orders(self):
        return self.user_orders.count() if self.user_orders is not None else 0

    @property
    def is_editable(self):
        return True

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

    @property
    def is_deletable(self):
        return False

    @property
    def is_editable(self):
        return False

    def __str__(self):
        return self.title if self.title is not None else 'Title Not Set'


class Log(models.Model):
    create_at = models.DateTimeField(auto_now_add=True)
    update_at = models.DateTimeField(auto_now=True, blank=True, null=True)
    action = models.CharField(max_length=128)
    info = models.CharField(max_length=255)
    data = models.TextField(null=True, blank=True)
    user = models.ForeignKey(User, related_name='logs', on_delete=models.CASCADE)

    @property
    def is_deletable(self):
        return False

    @property
    def is_editable(self):
        return False

    def __str__(self):
        return self.action if self.action is not None else 'Action Not Set'


class Enum(models.Model):
    create_at = models.DateTimeField(auto_now_add=True)
    update_at = models.DateTimeField(auto_now=True, blank=True, null=True)
    name = models.CharField(max_length=32, blank=True)
    data = models.TextField(null=True, blank=True)
    values = models.TextField(null=True, blank=True)
    max_value = models.IntegerField(default=100, null=True, blank=True)
    type = models.CharField(max_length=32, default='text')
    global_enum = models.BooleanField(default=False, null=True, blank=True)

    def __str__(self):
        return self.name if self.name is not None else 'Name Not Set'

    @property
    def is_deletable(self):
        return False

    @property
    def is_editable(self):
        return True


class Invoice(models.Model):
    ACTIONS_CHOICES = (
        ('A', 'Add Balance'),
        ('R', 'Remove Balance'),
        ('S', 'Set Balance'),
        ('P', 'Pay'),
    )
    action = models.CharField(max_length=1, default='A', choices=ACTIONS_CHOICES, null=True, blank=True)
    amount = models.FloatField(default=0, null=True, blank=True)
    details = models.CharField(max_length=254, default='', null=True, blank=True)
    user = models.ForeignKey(User, related_name='invoices', on_delete=models.CASCADE)
    create_at = models.DateTimeField(auto_now_add=True)

    @property
    def is_deletable(self):
        return False

    @property
    def is_editable(self):
        return False


class Game(models.Model):
    TYPE_CHOICES = (
        ('K', 'K'),
        ('C', 'C'),
    )
    PLATFORM_CHOICES = (
        ('C', 'C'),
        ('M', 'M'),
        ('P', 'P'),
        ('X', 'X'),
        ('G', 'G')
    )
    name = models.CharField(max_length=64, null=True, blank=True)
    card_name = models.CharField(max_length=64, null=True, blank=True)
    country = models.CharField(max_length=32, null=True, blank=True)
    show = models.BooleanField(default=True, null=True, blank=True)
    game_type = models.CharField(max_length=32, null=True, blank=True)
    type = models.CharField(max_length=2, default='K', choices=TYPE_CHOICES, null=True, blank=True)
    platform = models.CharField(max_length=2, default='C', choices=PLATFORM_CHOICES, null=True, blank=True)
    # Layouts
    notes = models.TextField(default='', null=True, blank=True)
    about = models.TextField(default='', null=True, blank=True)
    details = models.TextField(default='', null=True, blank=True)

    video = models.CharField(max_length=255, default='', null=True, blank=True)

    facebook = models.CharField(max_length=255, default='', null=True, blank=True)
    website = models.CharField(max_length=255, default='', null=True, blank=True)
    youtube = models.CharField(max_length=255, default='', null=True, blank=True)

    # Media
    logo = models.ImageField(upload_to='games/logo', blank=True, null=True)
    bg_cover = models.ImageField(upload_to='games/bg_cover', blank=True, null=True)
    bg_card = models.ImageField(upload_to='games/bg_card', blank=True, null=True)

    @property
    def game_orders(self):
        orders = []
        if self.game_cards is not None:
            for gc in self.game_cards.all():
                if gc.gc_orders is not None:
                    orders = [*orders, *gc.gc_orders.all()]
        return orders

    @property
    def game_complete_orders(self):
        orders = []
        if self.game_cards is not None:
            for gc in self.game_cards.all():
                if gc.gc_orders is not None:
                    orders = [*orders, *gc.gc_orders.filter(state='C')]
        return orders

    @property
    def total_orders(self):
        return len(self.game_orders)

    @property
    def total_reviews(self):
        total_reviews = 0
        for order in self.game_complete_orders:
            if order.review_star is not None:
                total_reviews += 1
        return total_reviews

    @property
    def review_stars(self):
        star_count = 0
        total_reviews = 0
        for order in self.game_complete_orders:
            if order.review_star is not None:
                total_reviews += 1
                star_count += order.review_star
        return (star_count / total_reviews) if total_reviews > 0 else 0

    @property
    def is_deletable(self):
        return (self.game_cards is None) or len(self.game_cards.all()) < 1

    @property
    def is_editable(self):
        return True


class GameCard(models.Model):
    game = models.ForeignKey(Game, related_name='game_cards', on_delete=models.CASCADE)
    name = models.CharField(max_length=64, null=True, blank=True)
    price = models.FloatField(default=1, null=True, blank=True)
    discount = models.FloatField(default=0.0, null=True, blank=True)
    max = models.IntegerField(default=10, null=True, blank=True)
    min = models.IntegerField(default=0, null=True, blank=True)
    points = models.IntegerField(default=0, null=True, blank=True)
    show = models.BooleanField(default=True, null=True, blank=True)
    sold_flag = models.BooleanField(default=False, null=True, blank=True)

    @property
    def total_price(self):
        discount = self.discount if self.discount is not None else 0
        return self.price - (self.price * discount / 100)

    @property
    def available_keys(self):
        return len(self.keys.filter(available=True))

    @property
    def available(self):
        return self.game.type == 'C' or (self.available_keys > 0 and self.order_min <= self.available_keys)

    @property
    def order_min(self):
        return self.min

    @property
    def order_max(self):
        if self.available_keys < self.max:
            return self.available_keys
        return self.max

    @property
    def is_sold(self):
        return (self.game.type == 'K' and self.available_keys < self.order_min) or self.sold_flag

    @property
    def is_deletable(self):
        return self.gc_orders.all().count() > 0

    @property
    def is_editable(self):
        return True


class Accessory(models.Model):
    name = models.CharField(max_length=64, null=True, blank=True)
    price = models.FloatField(default=1, null=True, blank=True)
    discount = models.FloatField(default=0.0, null=True, blank=True)
    points = models.IntegerField(default=0, null=True, blank=True)
    system_quantity = models.IntegerField(default=0, null=True, blank=True)
    max = models.IntegerField(default=10, null=True, blank=True)
    min = models.IntegerField(default=0, null=True, blank=True)
    show = models.BooleanField(default=True, null=True, blank=True)
    sold_flag = models.BooleanField(default=False, null=True, blank=True)
    type = models.CharField(max_length=32, null=True, blank=True)

    details = models.TextField(default='', null=True, blank=True)
    short_description = models.TextField(default='', null=True, blank=True)

    video = models.CharField(max_length=255, default='', null=True, blank=True)

    # Media
    logo = models.ImageField(upload_to='accessory/logo', blank=True, null=True)
    image1 = models.ImageField(upload_to='accessory/images', blank=True, null=True)
    image2 = models.ImageField(upload_to='accessory/images', blank=True, null=True)
    image3 = models.ImageField(upload_to='accessory/images', blank=True, null=True)
    image4 = models.ImageField(upload_to='accessory/images', blank=True, null=True)

    @property
    def total_price(self):
        discount = self.discount if self.discount is not None else 0
        return self.price - (self.price * discount / 100)

    @property
    def total_orders(self):
        return self.accessory_orders.all().count()

    @property
    def review_stars(self):
        star_count = 0
        total_reviews = 0
        for order in self.accessory_orders.filter(state='C'):
            if order.review_star is not None:
                total_reviews += 1
                star_count += order.review_star
        return (star_count / total_reviews) if total_reviews > 0 else 0

    @property
    def total_reviews(self):
        total_reviews = 0
        for order in self.accessory_orders.filter(state='C'):
            if order.review_star is not None:
                total_reviews += 1
        return total_reviews

    @property
    def order_min(self):
        return self.min

    @property
    def order_max(self):
        if self.system_quantity < self.max:
            return self.system_quantity
        return self.max

    @property
    def is_sold(self):
        return (self.system_quantity < 1) or (self.system_quantity < self.order_min) or self.sold_flag

    @property
    def is_deletable(self):
        return False

    @property
    def is_editable(self):
        return True


class EmbedGame(models.Model):
    src = models.CharField(max_length=500, null=True, blank=True)
    name = models.CharField(max_length=64, null=True, blank=True)
    type = models.CharField(max_length=32, null=True, blank=True)
    details = models.TextField(default='', null=True, blank=True)
    video = models.CharField(max_length=255, default='', null=True, blank=True)
    logo = models.ImageField(upload_to='embedGames/logo', blank=True, null=True)

    @property
    def is_deletable(self):
        return True

    @property
    def is_editable(self):
        return True


class Order(models.Model):
    ORDER_STATUS = (
        ('I', 'I'),
        ('C', 'C'),
        ('E', 'E'),
    )
    owner = models.ForeignKey(User, on_delete=models.DO_NOTHING, related_name='user_orders', null=True, blank=True)
    game_card = models.ForeignKey(GameCard, on_delete=models.DO_NOTHING, related_name='gc_orders', null=True,
                                  blank=True)
    accessory = models.ForeignKey(Accessory, on_delete=models.DO_NOTHING, related_name='accessory_orders', null=True,
                                  blank=True)
    create = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    account_id = models.CharField(max_length=255, null=True, blank=True)
    extra_info = models.TextField(null=True, blank=True)
    ship_location = models.CharField(max_length=500, null=True, blank=True)
    compete_date = models.DateTimeField(null=True, blank=True)
    review_date = models.DateTimeField(default=None, null=True, blank=True)
    review_star = models.IntegerField(null=True, blank=True)
    quantity = models.IntegerField(default=1, null=True, blank=True)

    review_description = models.TextField(max_length=555, null=True, blank=True)
    state = models.CharField(max_length=2, default='I', choices=ORDER_STATUS, null=True, blank=True)
    cost = models.FloatField(null=True, blank=True)
    error_msg = models.TextField(max_length=500, null=True, blank=True)

    @property
    def is_deletable(self):
        return True

    @property
    def is_editable(self):
        return True


class GameKey(models.Model):
    game_card = models.ForeignKey(GameCard, on_delete=models.DO_NOTHING, related_name='keys')
    order = models.ForeignKey(Order, on_delete=models.DO_NOTHING, related_name='order_keys', null=True, blank=True)
    description = models.TextField(default='', null=True, blank=True)
    available = models.BooleanField(default=True, null=True, blank=True)


class File(models.Model):
    file = models.ImageField(upload_to='general/files', blank=True, null=True)
    name = models.TextField(blank=True, null=True)

    @property
    def is_deletable(self):
        return True

    @property
    def is_editable(self):
        return True


class Ads(models.Model):
    name = models.CharField(max_length=128, blank=True, null=True)
    cover = models.ImageField(upload_to='ads/files', blank=True, null=True)
    external_link = models.TextField(blank=True, null=True)
    forward_id = models.CharField(max_length=16, blank=True, null=True)
    type = models.CharField(max_length=16, blank=True, null=True)
    show = models.BooleanField(default=True, null=True, blank=True)

    @property
    def is_deletable(self):
        return True

    @property
    def is_editable(self):
        return True
