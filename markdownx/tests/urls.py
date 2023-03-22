from django.conf.urls import include
from django.urls import path

from .views import TestView

urlpatterns = [
    path('testview/', TestView.as_view()),
    path('markdownx/', include('markdownx.urls')),
]
