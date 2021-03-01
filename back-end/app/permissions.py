import time

from app.models import (User)

current_user = None


def get_order_api_access(user: User):
    global current_user
    while True:
        if current_user is None or user.id == current_user:
            current_user = user.id
            return True
        time.sleep(3)


def release_order_api_access():
    global current_user
    current_user = None


"""
class SingleUserAllowed(permissions.BasePermission):

    def has_permission(self, request, view):
        user = request.user
        return view.kwargs.get('username', '') == request.user.username
"""
