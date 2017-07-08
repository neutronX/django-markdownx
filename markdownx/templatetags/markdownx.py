# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django import template
from django.utils.safestring import mark_safe

from ..utils import markdownify

register = template.Library()


@register.filter()
def markdown(value, arg=None):
    return mark_safe(markdownify(value))
