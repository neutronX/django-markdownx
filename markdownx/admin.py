from django.contrib import admin
from django.db import models

from .widgets import AdminMarkdownxWidget
from .models import MarkdownxField


class MarkdownxModelAdmin(admin.ModelAdmin):

    formfield_overrides = {
        MarkdownxField: {'widget': AdminMarkdownxWidget}
    }
