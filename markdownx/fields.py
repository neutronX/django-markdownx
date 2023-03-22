from django import forms

from .widgets import MarkdownxWidget


class MarkdownxFormField(forms.CharField):
    """
    Used in FormFields as a Markdown enabled replacement for ``CharField``.
    """

    def __init__(self, *args, **kwargs):
        """
        Arguments are similar to Django's default ``CharField``.

        See Django's `documentations on CharField`_ for additional information.

        .. _docs on Charfield: https://docs.djangoproject.com/en/dev/ref/models/fields/#django.db.models.CharField
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
