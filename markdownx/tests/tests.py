# coding: utf-8
from __future__ import unicode_literals

from django.template import Template, Context
from django.test import TestCase


class SimpleTest(TestCase):
    def test_me(self):
        response = self.client.get('/testview/')
        self.assertEqual(response.status_code, 200)


def render_template(content, **context_args):
    """
    Create a template with content ``content`` that first loads the markdownx tags.
    """
    template = Template("{% load markdownx %}" + content)
    return template.render(Context(context_args))


class TemplateTagsTest(TestCase):
    """
    Test all template tags
    """

    def test_load_tags(self):
        # Loading the template should not generate an error
        self.assertEqual(
            render_template(''),
            '',
        )

    def test_markdown_filter(self):
        self.assertEqual(
            render_template('{{ v|markdown }}', v='markdownx'),
            '<p>markdownx</p>',
        )
        self.assertEqual(
            render_template('{{ v|markdown }}', v='<p><b>markdownx</b></p>'),
            '<p><b>markdownx</b></p>',
        )
        self.assertHTMLEqual(
            render_template('{{ v|markdown }}', v='# title\n\n**markdownx**'),
            '<h1>title</h1><p><strong>markdownx</strong></p>',
        )
        self.assertHTMLEqual(
            render_template('{{ v|markdown }}', v='# title\n\n<p>markdownx</p>'),
            '<h1>title</h1><p>markdownx</p>',
        )
