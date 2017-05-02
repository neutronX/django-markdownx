"""
**MarkdownX** default URLs, to be added to URLs in the main project.

See URLs in :doc:`../../example` to learn more.
"""

from django.conf.urls import url

from .views import (
    ImageUploadView,
    MarkdownifyView,
)


urlpatterns = [
    url(r'^upload/$', ImageUploadView.as_view(), name='markdownx_upload'),
    url(r'^markdownify/$', MarkdownifyView.as_view(), name='markdownx_markdownify'),
]
