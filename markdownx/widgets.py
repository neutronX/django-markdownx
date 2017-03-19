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
        attrs = self.build_attrs(attrs, name=name)

        if 'class' in attrs:
            attrs['class'] += ' markdownx-editor'
        else:
            attrs.update({
                'class': 'markdownx-editor'
            })

        attrs['data-markdownx-editor-resizable'] = MARKDOWNX_EDITOR_RESIZABLE
        attrs['data-markdownx-urls-path'] = MARKDOWNX_URLS_PATH
        attrs['data-markdownx-upload-urls-path'] = MARKDOWNX_UPLOAD_URLS_PATH
        attrs['data-markdownx-latency'] = MARKDOWNX_SERVER_CALL_LATENCY

        widget = super(MarkdownxWidget, self).render(name, value, attrs, renderer)

        template = get_template('markdownx/widget.html')

        return template.render({
            'markdownx_editor': widget,
        })

    class Media:
        """

        """

        css = {
            'all': {'markdownx/css/markdownx.css', },
        }

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
