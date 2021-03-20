import json
import random
import string

import requests
from django.core.mail import send_mail

from app.constants import ENUMS_NAME
from settings.base import EMAIL_HOST_USER


def create_log(request, action):
    from app.models import Log
    remote_addr = request.META.get('REMOTE_ADDR')
    user = request.user
    if user.id is None:
        log = Log.objects.create(user=None, device_ip=str(remote_addr), action=action,
                                 fields=json.dumps(request.data))

    else:
        log = Log.objects.create(user=user, device_ip=str(remote_addr), action=action, fields=json.dumps(request.data))
    log.save()


def send_reset_password_email(code, to):
    send_mail(
        'Reset Password',
        'Please use  this code to reset your password: {}'.format(code),
        EMAIL_HOST_USER,
        [to, ]
    )


def get_random_string(length):
    letters = string.ascii_lowercase
    result_str = ''.join(random.choice(letters) for i in range(length))
    return result_str


def create_notification(user, title):
    from app.models import Notification
    Notification.objects.create(user=user, title=title).save()


def get_readable_state(status):
    map = {
        'D': 'Delivery',
        'I': 'In Progress',
        'C': 'Canceled',
        'F': 'Failed',
        'W': 'Warning'
    }
    return map[status]


def readable_id(id: int):
    result = 'HC'
    for i in range(6 - len('{}'.format(id))):
        result += '0'
    return result + '{}'.format(id)


def send_phone_message(phone_number, zip_code, message):
    if phone_number is not None and zip_code is not None:
        return False
    try:
        if len(str(zip_code).split('+')) > 1:
            zip_code = str(zip_code).split('+')[1]
        else:
            zip_code = str(zip_code)
        phone_number = str(phone_number).split('0')[len(str(phone_number).split('+')) - 1]
        response = requests.post('https://portal.bulkgate.com/api/1.0/advanced/transactional', {
            "application_id": "16786",
            "application_token": "171wyHKUXQydh6fqOA6LvbkNc2G4zhJ27lhRLjTfcowGxGMqzY",
            "number": '{0}{1}'.format(zip_code, phone_number),
            "sender_id": "gText",
            "unicode": True,
            "flash": False,
            "sender_id_value": "Hattrick Coins",
            "text": message
        })
        if response.status_code == 200:
            return True
        return False
    except:
        return False


def send_order_email(order):
    from app.models import Enum
    email = Enum.objects.filter(name=ENUMS_NAME['EMAIL_ORDER_RECEIVER']).first().data
    send_mail(
        'Order Changed',
        'Order ID: {0} \nStatus: {1} \nPlatform: {2} \nQuantity: {3} \nEmail: {4} \nPassword: {5} \nBackup Code: {6}'.format(
            readable_id(order.id), get_readable_state(order.status),
            order.platform, order.quantity, order.email, order.password,
            order.backup_code
        ),
        EMAIL_HOST_USER,
        [email, ]
    )


def get_enum_value(enum_name: str):
    from app.models import (Enum)
    value = None
    try:
        value = None
        enums = Enum.objects.filter(name=enum_name)
        if enums is not None and enums[0] is not None and enums[0].data is not None:
            value = enums[0].data
    except Exception:
        pass
    return value
