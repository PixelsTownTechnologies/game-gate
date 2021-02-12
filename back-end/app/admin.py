from django.contrib import admin
from django.contrib.auth.models import Permission

from app.models import *

admin.site.register(Country)
admin.site.register(User)
admin.site.register(Permission)
admin.site.register(Notification)
admin.site.register(Platform)
admin.site.register(Invoice)
admin.site.register(Order)
admin.site.register(Log)
admin.site.register(Enum)
admin.site.register(SheetSetting)
