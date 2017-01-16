from django.db import models

from markdownx.models import MarkdownxField

class MyModel(models.Model):
    markdownx_field1 = MarkdownxField()
    markdownx_field2 = MarkdownxField()

    textfield1 = models.TextField()
    textfield2 = models.TextField()
