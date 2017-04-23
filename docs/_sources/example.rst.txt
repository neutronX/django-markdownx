Example
=======

Model
-----
.. code-block:: python
    :linenos:

    from markdownx.models import MarkdownxField

    class MyModel(models.Model):
        myfield = MarkdownxField()


... and then, include a form's required media in the template using ``{{ form.media }}``:

.. code-block:: html

    <form method="POST" action="">{% csrf_token %}
        {{ form }}
    </form>

    {{ form.media }}


Form
----
.. code-block:: python
    :linenos:

    from markdownx.fields import MarkdownxFormField

    class MyForm(forms.Form):
        myfield = MarkdownxFormField()


... and then, include a form's required media in the template using ``{{ form.media }}``:

.. code-block:: html

    <form method="POST" action="">{% csrf_token %}
        {{ form }}
    </form>

    {{ form.media }}


Django Admin
------------
When using included ``MarkdowxModel`` class in your models, just use ``MarkdownxModelAdmin`` in
your :guilabel:`admin.py` as follows:

.. code-block:: python
    :linenos:

    from django.contrib import admin
    from markdownx.admin import MarkdownxModelAdmin
    from .models import MyModel


    admin.site.register(MyModel, MarkdownxModelAdmin)


Field customization
...................
We have ensured that **MarkdownX** is fully extensible and provides a high degree of flexibility in development.

There are times that you may wish to Markdownify a different type field, or utilize your own customized model. To
accommodate this, we have provided the tools to apply **MarkdownX** infrastructure to other fields through *Widgets*.

For instance, to apply **MarkdownX** to ``TextField`` instances in your Django Admins, you can override the default
widget in the Admins module in :guilabel:`admin.py` of your Django App as follows:

.. code-block:: python
    :linenos:

    from django.db import models
    from django.contrib import admin

    from markdownx.widgets import AdminMarkdownxWidget

    from .models import MyModel


    class MyModelAdmin(admin.ModelAdmin):
        formfield_overrides = {
            models.TextField: {'widget': AdminMarkdownxWidget},
        }


    admin.site.register(MyModel, MyModelAdmin)
