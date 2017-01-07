from django import forms

from .widgets import (
    MarkdownxWidget,
    AdminMarkdownxWidget,
)


class MarkdownxFormField(forms.CharField):

    def __init__(self, *args, **kwargs):
        super(MarkdownxFormField, self).__init__(*args, **kwargs)

        if issubclass(self.widget.__class__, forms.widgets.MultiWidget):
            if not any([
                issubclass(x.__class__, MarkdownxWidget)
                for x in self.widget.widgets
            ]):
                self.widget = MarkdownxWidget()
        elif not issubclass(self.widget.__class__, MarkdownxWidget):
            self.widget = MarkdownxWidget()
