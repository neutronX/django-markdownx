from django.db import models
from django.contrib import admin

from markdownx.admin import MarkdownxModelAdmin
from .models import MyModel

admin.site.register(MyModel, MarkdownxModelAdmin)
