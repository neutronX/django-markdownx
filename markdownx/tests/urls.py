try:
    from django.conf.urls import include, url
except ImportError:
    from django.urls import include, re_path as url

from .views import TestView

urlpatterns = [
    url(r'^testview/', TestView.as_view()),
    url(r'^markdownx/', include('markdownx.urls')),
]
