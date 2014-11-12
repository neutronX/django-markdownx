from django.conf.urls import url

from .views import (
    ImageUploadView,
    MarkdownifyView,
)

urlpatterns = [
    url(r'^upload/$', ImageUploadView.as_view()),
    url(r'^markdownify/$', MarkdownifyView.as_view()),
]
