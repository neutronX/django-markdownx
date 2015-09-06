from django.db import models

from .fields import MarkdownxFormField


class MarkdownxField(models.TextField):

    def formfield(self, **kwargs):
        defaults = {'form_class': MarkdownxFormField}
        defaults.update(kwargs)
        return super(MarkdownxField, self).formfield(**defaults)
