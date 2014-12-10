from django import template

import markdown

register = template.Library()

@register.filter
def markdownify(text):
    return markdown.markdown(text)
