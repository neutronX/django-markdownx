from django import forms
from django.template.loader import get_template
from django.contrib.admin import widgets

from .settings import (
    MARKDOWNX_EDITOR_RESIZABLE,
    MARKDOWNX_URLS_PATH,
    MARKDOWNX_UPLOAD_URLS_PATH,
)


class MarkdownxWidget(forms.Textarea):

    def render(self, name, value, attrs=None):
        attrs = self.build_attrs(attrs, name=name)

        if 'class' in attrs:
            attrs['class'] += ' markdownx-editor'
        else:
            attrs.update({'class':'markdownx-editor'})

        attrs['data-markdownx-editor-resizable'] = MARKDOWNX_EDITOR_RESIZABLE
        attrs['data-markdownx-urls-path'] = MARKDOWNX_URLS_PATH
        attrs['data-markdownx-upload-urls-path'] = MARKDOWNX_UPLOAD_URLS_PATH

        widget = super(MarkdownxWidget, self).render(name, value, attrs)

        template = get_template('markdownx/widget.html')

        return template.render({
            'markdownx_editor': widget,
        })

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
