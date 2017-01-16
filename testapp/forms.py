from django import forms

from markdownx.fields import MarkdownxFormField
from markdownx.widgets import MarkdownxWidget

class MyForm(forms.Form):
    markdownx_form_field1 = MarkdownxFormField(widget=MarkdownxWidget(attrs={'class':'custom-class-markdownx_form_field1'}))
    markdownx_form_field2 = MarkdownxFormField(widget=MarkdownxWidget(attrs={'class':'custom-class-markdownx_form_field2'}))
