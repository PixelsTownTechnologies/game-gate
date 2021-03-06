from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path

from app.controllers.games import *
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

]

urlpatterns_invoice = [
    path('admin/invoice', InvoiceAdminFetchCreate.as_view()),
    path('user/invoice', InvoiceUserFetchCreate.as_view()),
]

urlpatterns_enum = [
    path('enums', EnumFetch.as_view()),
    path('enums/<pk>', EnumUpdate.as_view())
]

urlpatterns_games = [
    path('admin/fc/game', GameFetchCreate.as_view()),
    path('admin/game/<pk>', GameUpdateDelete.as_view()),
    path('admin/fc/game-card', GameCardFetchCreate.as_view()),
    path('admin/game-card/<pk>', GameCardUpdateDelete.as_view())
]

routes = [
    path('home/', home),
    path('admin/', admin.site.urls),
    *urlpatterns_users,
    *urlpatterns_orders,
    *urlpatterns_invoice,
    *urlpatterns_enum,
    *urlpatterns_games
]

urlpatterns = [*routes] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
