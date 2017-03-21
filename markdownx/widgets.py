from django import VERSION as DJANGO_VERSION
from django import forms
from django.template.loader import get_template
from django.contrib.admin import widgets
from django.conf import settings

from .settings import (
    MARKDOWNX_EDITOR_RESIZABLE,
    MARKDOWNX_URLS_PATH,
    MARKDOWNX_UPLOAD_URLS_PATH,
    MARKDOWNX_SERVER_CALL_LATENCY
)


DEBUG = getattr(settings, 'DEBUG', False)


class MarkdownxWidget(forms.Textarea):
    """

    """

    if DJANGO_VERSION[:2] >= (1, 11):
        template_name = 'markdownx/widget2.html'

    def get_context(self, name, value, attrs=None):
        """

        :param name:
        :type name:
        :param value:
        :type value:
        :param attrs:
        :type attrs:
        :return:
        :rtype:
        """
        if not DJANGO_VERSION[:2] >= (1, 11):
            return super(MarkdownxWidget, self).get_context(name, value, attrs)

        if attrs is None:
            attrs = {}

        attrs.update(self.add_markdownx_attrs(attrs))

        return super(MarkdownxWidget, self).get_context(name, value, attrs)

    def render(self, name, value, attrs=None, renderer=None):
        """

        :param name:
        :type name:
        :param value:
        :type value:
        :param attrs:
        :type attrs:
        :param renderer:
        :type renderer:
        :return:
        :rtype:
        """
        if not DJANGO_VERSION[:2] < (1, 11):
            return super(MarkdownxWidget, self).render(name, value, attrs, renderer)

        attrs = self.build_attrs(attrs, name=name)
        attrs.update(self.add_markdownx_attrs(attrs))

        widget = super(MarkdownxWidget, self).render(name, value, attrs)

        template = get_template('markdownx/widget.html')

        return template.render({
            'markdownx_editor': widget,
        })

    @staticmethod
    def add_markdownx_attrs(attrs):
        """

        :param attrs:
        :type attrs:
        :return:
        :rtype:
        """
        if 'class' in attrs:
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
        """

        """

        js = {
            'markdownx/js/' + ('markdownx.min.js' if not DEBUG else 'markdownx.js'),
        }


class AdminMarkdownxWidget(MarkdownxWidget, widgets.AdminTextareaWidget):
    """

    """

    class Media:
        """

        """

        css = {
            'all': {'markdownx/admin/css/markdownx.css', }
        }

        js = {
            'markdownx/js/' + ('markdownx.min.js' if not DEBUG else 'markdownx.js'),
        }
