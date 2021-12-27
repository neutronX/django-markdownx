from django.conf import settings

try:
    from django.conf.urls import include, url
except ImportError:
    from django.urls import include, re_path as url

from django.conf.urls.static import static
from django.contrib import admin

from testapp.views import TestFormView


urlpatterns = [
    url(r'^$', TestFormView.as_view(), name='form_view'),
    url(r'^markdownx/', include('markdownx.urls')),
    url(r'^admin/', admin.site.urls),
    *static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
]
