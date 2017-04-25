Example
=======

Have you:

- successfully :doc:`installed MarkdownX<installation>`?

- followed the instructions on how to :doc:`get started<getting_started>`?

If so, you are set for the next step. Here you can find comprehensive examples of how to use different **MarkdownX**
features to your advantage.

Model
-----

This is how you implement a **MarkdownX** field in your models. In your :guilabel:`app/models.py`:

.. code-block:: python
    :linenos:

    from markdownx.models import MarkdownxField

    class MyModel(models.Model):
        myfield = MarkdownxField()

... and then, include the form media in the relevant template using ``{{ form.media }}``, like so:

.. code-block:: html

    <form method="POST" action="">{% csrf_token %}
        {{ form }}
    </form>

    {{ form.media }}

.. note::
    The field extends Django's own TextField_ and is saved in the database accordingly.

Form
----
You can also implement **MarkdownX** through the forms. This will be done in your :guilabel:`app/forms.py` as follows:

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
your :guilabel:`app/admin.py` as follows:

.. code-block:: python
    :linenos:

    from django.contrib import admin
    from markdownx.admin import MarkdownxModelAdmin
    from .models import MyModel


    admin.site.register(MyModel, MarkdownxModelAdmin)

Advanced
--------

Template customization
......................

The default widget is as seen `here
<https://github.com/neutronX/django-markdownx/blob/master/markdownx/templates/markdownx/widget.html>`_.

If you would like to customise this; for instance, using `Bootstrap <https://getbootstrap.com>`_ to implement
side-by-side panes (as seen in :doc:`preview animation<index>`), you should override the default template by creating
your own template and saving it under ``markdownx/widget.html`` (Django 1.11+) or ``markdownx/widget2.html`` (Django
1.10 and below) in your project's :guilabel:`TEMPLATE_DIRS`.

Here is an example of the contents:

.. code-block:: html

    <div class="markdownx row">
        <div class="col-md-6">
            {{ markdownx_editor }}
        </div>
        <div class="col-md-6">
            <div class="markdownx-preview"></div>
        </div>
    </div>


Field customization
...................

We have ensured that **MarkdownX** is fully extensible and provides a high degree of flexibility in development.

There are times that you may wish to Markdownify a different type of field, or utilize your own customized widget. To
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


Custom image tags
.................
Markdown uses ``![]()`` tag by default to insert uploaded image file. This generates a simple (X)HTML ``<image>`` tag.
If you wish to have more control and use your own HTML tags, you may create a custom ``form_valid()`` function in
``ImageUploadView`` class, as highlighted `here
<https://github.com/neutronX/django-markdownx/blob/master/markdownx/views.py#L55-L82>`_.


.. _TextField: https://docs.djangoproject.com/en/dev/ref/models/fields/#django.db.models.TextField