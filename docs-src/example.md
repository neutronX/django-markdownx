# Example

Have you:

- successfully [installed MarkdownX](installation.md)?
- followed the instructions on how to [get started](getting_started.md)?

If so, you are set for the next step. Here you can find comprehensive examples of how to use different MarkdownX
features to your advantage.


## Model

This is how you implement a MarkdownX field in your models. In your `app/models.py`:

```python
from markdownx.models import MarkdownxField

class MyModel(models.Model):
	myfield = MarkdownxField()
```

... and then, include the form media in the relevant template using ``{{ form.media }}``, like so:

```html
<form method="POST" action="">{% csrf_token %}
    {{ form }}
</form>

{{ form.media }}
```

!!! note
	The field extends Django's own [TextField](https://docs.djangoproject.com/en/dev/ref/models/fields/#django.db.models.TextField) and is saved in the database accordingly.

## Form

You can also implement MarkdownX through the forms. This will be done in your `app/forms.py` as follows:

```python
from markdownx.fields import MarkdownxFormField

class MyForm(forms.Form):
    myfield = MarkdownxFormField()
```

... and then, include a form's required media in the template using ``{{ form.media }}``:

```html
<form method="POST" action="">{% csrf_token %}
    {{ form }}
</form>

{{ form.media }}
```

## Django Admin

When using included ``MarkdowxModel`` class in your models, just use ``MarkdownxModelAdmin`` in your `app/admin.py` as follows:

```python
from django.contrib import admin
from markdownx.admin import MarkdownxModelAdmin
from .models import MyModel

admin.site.register(MyModel, MarkdownxModelAdmin)
```
