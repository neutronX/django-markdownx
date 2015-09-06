from django import forms
from django.template import Context
from django.template.loader import get_template
from django.contrib.admin import widgets


class MarkdownxWidget(forms.Textarea):

    def render(self, name, value, attrs=None):
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
