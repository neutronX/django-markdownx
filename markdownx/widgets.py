from copy import copy

from django import VERSION as DJANGO_VERSION
from django import forms
from django.template.loader import get_template
from django.contrib.admin import widgets
from django.conf import settings
from django.core.exceptions import ImproperlyConfigured

from .settings import (
    MARKDOWNX_EDITOR_RESIZABLE,
    MARKDOWNX_URLS_PATH,
    MARKDOWNX_UPLOAD_URLS_PATH,
    MARKDOWNX_SERVER_CALL_LATENCY
)


try:
    DEBUG = getattr(settings, 'DEBUG', False)
except ImproperlyConfigured:
    # Documentations work around.
    DEBUG = False

# For backward compatiblity methods.
is_post_10 = DJANGO_VERSION[:2] > (1, 10)

minified = '.min' if not DEBUG else str()


class MarkdownxWidget(forms.Textarea):
    """
    MarkdownX TextArea widget for forms. Markdown enabled version of
    Django "TextArea" widget.
    """

    template_name = 'markdownx/widget{}.html'.format('2' if is_post_10 else str())

    def get_context(self, name, value, attrs=None):
        """
        Context for the template in Django 1.10 or below.
        """
        if not is_post_10:
            # pre 10, django did not use build_attrs, manually updating attrs here
            attrs.update(self.get_markdownx_attrs(attrs))
            return super(MarkdownxWidget, self).get_context(name, value, attrs)

        return super(MarkdownxWidget, self).get_context(name, value, attrs)

    def render(self, name, value, attrs=None, renderer=None):
        """
        Rendering the template and attributes thereof in Django 1.11+.

        .. Note::
            Not accepting ``renderer`` is deprecated in Django 1.11.
        """

        if is_post_10:
            return super(MarkdownxWidget, self).render(name, value, attrs, renderer)

        widget = super(MarkdownxWidget, self).render(name, value, attrs)

        template = get_template(self.template_name)

        return template.render({
            'markdownx_editor': widget,
        })

    def build_attrs(self, attrs, extra_attrs=dict()):
        extra_attrs.update(self.get_markdownx_attrs(attrs))
        return super(MarkdownxWidget, self).build_attrs(attrs, extra_attrs)

    @staticmethod
    def get_markdownx_attrs(attrs):
        """
        Getting (X)HTML node attributes.

        :param attrs: Attributes to be set.
        :type attrs: dict
        :return: Dictionary of markdownx attributes, excluding the default attributes.
        :rtype: dict
        """
        default_attrs = {
            'data-markdownx-editor-resizable': MARKDOWNX_EDITOR_RESIZABLE,
            'data-markdownx-urls-path': MARKDOWNX_URLS_PATH,
            'data-markdownx-upload-urls-path': MARKDOWNX_UPLOAD_URLS_PATH,
            'data-markdownx-latency': MARKDOWNX_SERVER_CALL_LATENCY
        }

        new_attrs = copy(default_attrs)
        # Remove keys that are already present in supplied attrs as to not override
        for key, _ in default_attrs.items():
            if key in attrs:
                del new_attrs[key]

        existing_classes = attrs.get('class', '')
        new_attrs.update({
            'class': existing_classes + ' markdownx-editor'
        })

        return new_attrs

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
