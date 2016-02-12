from django import forms
from django.template import Context
from django.template.loader import get_template
from django.contrib.admin import widgets

from .settings import (
    MARKDOWNX_EDITOR_RESIZABLE,
    MARKDOWNX_URLS_PATH,
    MARKDOWNX_UPLOAD_URLS_PATH,
)


class MarkdownxWidget(forms.Textarea):

    def render(self, name, value, attrs=None):
        if attrs is None:
            attrs = {}
        elif 'class' in attrs:
            attrs['class'] += ' markdownx-editor'
        else:
            attrs.update({'class':'markdownx-editor'})

        attrs['data-markdownx-editor-resizable'] = MARKDOWNX_EDITOR_RESIZABLE
        attrs['data-markdownx-urls-path'] = MARKDOWNX_URLS_PATH
        attrs['data-markdownx-upload-urls-path'] = MARKDOWNX_UPLOAD_URLS_PATH

        widget = super(MarkdownxWidget, self).render(name, value, attrs)

        t = get_template('markdownx/widget.html')
        c = Context({
            'markdownx_editor': widget,
        })

        return t.render(c)

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
