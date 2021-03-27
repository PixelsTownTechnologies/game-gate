import time

from app.models import (User)

current_user = None
last_access = None


def get_order_api_access(user: User):
    global current_user
    global last_access
    while True:
        if current_user is None or user.id == current_user:
            current_user = user.id
            last_access = time.time()
            return True
        if last_access is not None and (last_access - time.time()) > 10:
            current_user = user.id
            last_access = time.time()
            return True
        time.sleep(1.2)


def release_order_api_access():
    global current_user
    current_user = None


"""
class SingleUserAllowed(permissions.BasePermission):

    def has_permission(self, request, view):
        user = request.user
        return view.kwargs.get('username', '') == request.user.username
"""
