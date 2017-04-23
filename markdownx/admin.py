from django.contrib import admin

from .widgets import AdminMarkdownxWidget
from .models import MarkdownxField


class MarkdownxModelAdmin(admin.ModelAdmin):
    """
    
    """

    formfield_overrides = {
        MarkdownxField: {'widget': AdminMarkdownxWidget}
    }
