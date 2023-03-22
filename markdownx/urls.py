"""
**MarkdownX** default URLs, to be added to URLs in the main project.

See URLs in :doc:`../../example` to learn more.
"""

from django.urls import path

from .views import ImageUploadView
from .views import MarkdownifyView


urlpatterns = [
    path('upload/', ImageUploadView.as_view(), name='markdownx_upload'),
    path('markdownify/', MarkdownifyView.as_view(), name='markdownx_markdownify'),
]
