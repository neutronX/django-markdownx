from django import forms

from markdownx.fields import MarkdownxFormField

class MyForm(forms.Form):
    markdownx_form_field1 = MarkdownxFormField()
    markdownx_form_field2 = MarkdownxFormField()
