from django.contrib import admin

from .models import MarkdownxField
from .widgets import AdminMarkdownxWidget


class MarkdownxModelAdmin(admin.ModelAdmin):
    """
    Django admin representation for ``MarkdownxField`` in models.

    See **Django Admin** in :doc:`../../example` for additional information.
    """

    formfield_overrides = {
        MarkdownxField: {'widget': AdminMarkdownxWidget}
    }
