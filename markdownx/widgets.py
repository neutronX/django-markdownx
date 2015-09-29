from django import forms
from django.template import Context
from django.template.loader import get_template
from django.contrib.admin import widgets

from .settings import MARKDOWNX_EDITOR_RESIZABLE


class MarkdownxWidget(forms.Textarea):

    def render(self, name, value, attrs=None):
        if 'class' in attrs.keys():
            attrs['class'] += ' markdownx-editor'
        else:
            attrs.update({'class':'markdownx-editor'})

        attrs['data-markdownx-editor-resizable'] = MARKDOWNX_EDITOR_RESIZABLE

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
