from django.contrib import admin
from django.urls import path

from app.controllers.general import *
from app.controllers.user import *

urlpatterns_users = [
    path('user/check-token', check_token),
    path('user/check-email', check_email),
    path('user/login', AuthToken.as_view()),
    path('user/register', RegisterUser.as_view()),
    path('user/logout', LogoutUser.as_view()),
    path('admin/cg-users', AdminUserFetchCreate.as_view()),
    path('admin/users/<pk>', AdminUser.as_view()),
    path('user/admin/change-groups/<pk>', AdminChangeGroups.as_view()),
    path('user/groups', AdminListGroups.as_view()),
    path('user/change-password', ChangePasswordUser.as_view()),
    path('user/update-data', UserUpdateData.as_view()),
    path('user/reset-password/send/', reset_code_view),
    path('user/reset-password/check/', check_reset_code),
    path('user/reset-password/change/', change_password_view),
]


urlpatterns_orders = [
    path('user/orders', OrderUserFetchCreate.as_view()),
    path('user/order/<pk>', OrderUserUpdate.as_view()),

    path('user/order/review/<pk>', OrderUserReview.as_view()),
    path('user/admin/orders', OrderAdminFetchCreate.as_view()),
    path('user/admin/orders/<pk>', OrderAdminUpdate.as_view()),
]

urlpatterns_invoice = [
    path('admin/invoice', InvoiceAdminFetchCreate.as_view()),
    path('user/invoice', InvoiceUserFetchCreate.as_view()),
]

urlpatterns_enum = [
    path('enums', EnumFetch.as_view()),
    path('enums/<pk>', EnumUpdate.as_view())
]

urlpatterns = [
    path('home/', home),
    path('admin/', admin.site.urls),
    *urlpatterns_users,
    *urlpatterns_orders,
    *urlpatterns_invoice,
    *urlpatterns_enum
]
