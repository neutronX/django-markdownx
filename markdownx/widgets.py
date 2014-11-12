from django.conf import settings
from django.forms import Textarea
from django.template import Context
from django.template.loader import get_template


class MarkdownxInput(Textarea):
    def __init__(self, attrs=None):

        default_attrs = {
            'id': 'markdownx_editor',
        }
        if attrs:
            default_attrs.update(attrs)

        super(Textarea, self).__init__(default_attrs)

    def render(self, name, value, attrs=None):
        textarea = Textarea.render(self, name, value)

        t = get_template('markdownx/widget.html')
        c = Context({
            'markdownx_editor': textarea,
        })

        return t.render(c)

    class Media:
        js = (
            'js/markdownx.js',
        )
