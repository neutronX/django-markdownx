from django.conf.urls import include, path

from .views import TestView

urlpatterns = [
    path('testview/', TestView.as_view()),
    path('markdownx/', include('markdownx.urls')),
]
