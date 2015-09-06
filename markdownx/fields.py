from django import forms

from .settings import MARKDOWNX_EDITOR_RESIZABLE
from .widgets import (
    MarkdownxWidget,
    AdminMarkdownxWidget,
)


class MarkdownxFormField(forms.CharField):

    def __init__(self, *args, **kwargs):
        super(MarkdownxFormField, self).__init__(*args, **kwargs)

        if self.widget.__class__ != AdminMarkdownxWidget:
            self.widget = MarkdownxWidget()

        if self.widget.attrs.has_key('class'):
            self.widget.attrs['class'] += ' markdownx-editor'
        else:
            self.widget.attrs.update({'class':'markdownx-editor'})

        self.widget.attrs['data-markdownx-editor-resizable'] = MARKDOWNX_EDITOR_RESIZABLE
