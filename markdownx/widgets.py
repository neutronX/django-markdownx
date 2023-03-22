from django import forms
from django.conf import settings
from django.contrib.admin import widgets
from django.core.exceptions import ImproperlyConfigured

from .settings import MARKDOWNX_EDITOR_RESIZABLE
from .settings import MARKDOWNX_SERVER_CALL_LATENCY
from .settings import MARKDOWNX_UPLOAD_URLS_PATH
from .settings import MARKDOWNX_URLS_PATH


try:
    DEBUG = getattr(settings, 'DEBUG', False)
except ImproperlyConfigured:
    # Documentations work around.
    DEBUG = False

minified = '.min' if not DEBUG else str()


class MarkdownxWidget(forms.Textarea):
    """
    MarkdownX TextArea widget for forms. Markdown enabled version of
    Django "TextArea" widget.
    """

    template_name = 'markdownx/widget.html'

    def get_context(self, name, value, attrs=None):
        """
        Context for the template in Django
        """
        try:
            attrs.update(self.add_markdownx_attrs(attrs))
        except AttributeError:
            attrs = self.add_markdownx_attrs(attrs)

        return super(MarkdownxWidget, self).get_context(name, value, attrs)

    def render(self, name, value, attrs=None, renderer=None):
        """
        Rendering the template and attributes
        """
        attrs.update(self.attrs)
        attrs.update(self.add_markdownx_attrs(attrs))

        return super(MarkdownxWidget, self).render(name, value, attrs, renderer)

    @staticmethod
    def add_markdownx_attrs(attrs):
        """
        Setting (X)HTML node attributes.

        :param attrs: Attributes to be set.
        :type attrs: dict
        :return: Dictionary of attributes, including the default attributes.
        :rtype: dict
        """
        if 'class' in attrs.keys():
            if 'markdownx-editor' not in attrs['class']:
                attrs['class'] += ' markdownx-editor'
        else:
            attrs.update({
                'class': 'markdownx-editor'
            })

        attrs.update({
            'data-markdownx-editor-resizable': MARKDOWNX_EDITOR_RESIZABLE,
            'data-markdownx-urls-path': MARKDOWNX_URLS_PATH,
            'data-markdownx-upload-urls-path': MARKDOWNX_UPLOAD_URLS_PATH,
            'data-markdownx-latency': MARKDOWNX_SERVER_CALL_LATENCY
        })

        return attrs

    class Media:
        js = [
            'markdownx/js/markdownx{}.js'.format(minified),
        ]


class AdminMarkdownxWidget(MarkdownxWidget, widgets.AdminTextareaWidget):
    """
    MarkdownX TextArea widget for admin. Markdown enabled version of
    Django "TextArea" widget.
    """

    class Media:
        css = {
            'all': ['markdownx/admin/css/markdownx{}.css'.format(minified)]
        }

        js = [
            'markdownx/js/markdownx{}.js'.format(minified),
        ]
