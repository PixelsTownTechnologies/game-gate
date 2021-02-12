import os
import sub_script
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'settings.local')

sub_script.index()
application = get_wsgi_application()
