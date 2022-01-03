"""
**MarkdownX** default URLs, to be added to URLs in the main project.

See URLs in :doc:`../../example` to learn more.
"""
try:
    from django.conf.urls import url
except ImportError:
    from django.urls import re_path as url

from .views import (
    ImageUploadView,
    MarkdownifyView,
)


urlpatterns = [
    url('upload/', ImageUploadView.as_view(), name='markdownx_upload'),
    url('markdownify/', MarkdownifyView.as_view(), name='markdownx_markdownify'),
]
