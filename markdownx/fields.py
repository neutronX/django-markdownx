from django import forms

from .widgets import (
    MarkdownxWidget,
    AdminMarkdownxWidget,
)


class MarkdownxFormField(forms.CharField):

    def __init__(self, *args, **kwargs):
        super(MarkdownxFormField, self).__init__(*args, **kwargs)

        if not issubclass(self.widget.__class__, MarkdownxWidget):
            self.widget = MarkdownxWidget()
