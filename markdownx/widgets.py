import django
from django import forms
from django.template.loader import get_template
from django.contrib.admin import widgets

from .settings import (
    MARKDOWNX_EDITOR_RESIZABLE,
    MARKDOWNX_URLS_PATH,
    MARKDOWNX_UPLOAD_URLS_PATH,
)


class MarkdownxWidget(forms.Textarea):

    if django.VERSION[:2] >= (1, 11):

        template_name = 'markdownx/widget2.html'

        def get_context(self, name, value, attrs=None):
            if attrs is None:
                attrs = {}

            self.add_markdownx_attrs(attrs)

            return super(MarkdownxWidget, self).get_context(name, value, attrs)

    else:

        def render(self, name, value, attrs=None):
            attrs = self.build_attrs(attrs, name=name)

            self.add_markdownx_attrs(attrs)

            widget = super(MarkdownxWidget, self).render(name, value, attrs)

            template = get_template('markdownx/widget.html')

            return template.render({
                'markdownx_editor': widget,
            })

    @staticmethod
    def add_markdownx_attrs(attrs):
        if 'class' in attrs:
            attrs['class'] += ' markdownx-editor'
        else:
            attrs['class'] = 'markdownx-editor'
        attrs['data-markdownx-editor-resizable'] = MARKDOWNX_EDITOR_RESIZABLE
        attrs['data-markdownx-urls-path'] = MARKDOWNX_URLS_PATH
        attrs['data-markdownx-upload-urls-path'] = MARKDOWNX_UPLOAD_URLS_PATH


    class Media:
        js = (
            'markdownx/js/markdownx.js',
        )


class AdminMarkdownxWidget(MarkdownxWidget, widgets.AdminTextareaWidget):

    class Media:
        css = {
            'all': ('markdownx/admin/css/markdownx.css',)
        }
        js = (
            'markdownx/js/markdownx.js',
        )
