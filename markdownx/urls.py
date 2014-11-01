from django.conf.urls import url

from .views import ImageUploadView

urlpatterns = [
    url(r'^upload/$', ImageUploadView.as_view()),
]
