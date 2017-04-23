from django import forms

from .widgets import MarkdownxWidget


class MarkdownxFormField(forms.CharField):
    """

    """

    def __init__(self, *args, **kwargs):
        """

        :param args:
        :type args:
        :param kwargs:
        :type kwargs:
        """
        super(MarkdownxFormField, self).__init__(*args, **kwargs)

        if issubclass(self.widget.__class__, forms.widgets.MultiWidget):
            is_markdownx_widget = any(
                issubclass(item.__class__, MarkdownxWidget)
                for item in getattr(self.widget, 'widgets', list())
            )

            if not is_markdownx_widget:
                self.widget = MarkdownxWidget()

        elif not issubclass(self.widget.__class__, MarkdownxWidget):
            self.widget = MarkdownxWidget()
