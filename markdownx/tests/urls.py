from django.conf.urls import include, url

from .views import TestView

urlpatterns = [
    url(r'^testview/$', TestView.as_view()),
    url(r'^markdownx/', include('markdownx.urls')),
]
