from django.db import models
from django.contrib.admin import ModelAdmin, site

from markdownx.widgets import AdminMarkdownxWidget
from markdownx.models import MarkdownxField

from .models import MyModel


@site.register(MyModel)
class MyModelAdmin(ModelAdmin):
    formfield_overrides = {
        MarkdownxField: {'widget': AdminMarkdownxWidget},
        models.TextField: {'widget': AdminMarkdownxWidget},
    }

# site.register(MyModel, MyModelAdmin)

##
## SHORTER OPTION:
##

# from django.contrib import admin

# from markdownx.admin import MarkdownxModelAdmin

# from .models import MyModel

# admin.site.register(MyModel, MarkdownxModelAdmin)
