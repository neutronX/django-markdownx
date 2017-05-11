Customization
=============

----

General (ex. settings)
**********************

Templates
---------

The default widget is as seen `here
<https://github.com/neutronX/django-markdownx/blob/master/markdownx/templates/markdownx/widget.html>`_.

If you would like to customise this; for instance, using `Bootstrap <https://getbootstrap.com>`_ to implement
side-by-side panes (as seen in :doc:`preview animation<index>`), you should override the default template by creating
your own template and saving it under ``markdownx/widget2.html`` (Django 1.11+) or ``markdownx/widget.html`` (Django
1.10 and below) in your project's :guilabel:`TEMPLATE_DIRS`.

Here is an example of the contents:

.. code-block:: html

    <div class="markdownx row">
        <div class="col-md-6">
            <!-- Django 1.10 and below -->
            {{ markdownx_editor }}
            <!-- Django 1.11+ -->
            {% include 'django/forms/widgets/textarea.html' %}
        </div>
        <div class="col-md-6">
            <div class="markdownx-preview"></div>
        </div>
    </div>


Fields
------

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


Image tags
----------

Markdown uses ``![]()`` tag by default to insert uploaded image file. This generates a simple (X)HTML ``<image>`` tag.
If you wish to have more control and use your own HTML tags, you may create a custom ``form_valid()`` function in
``ImageUploadView`` class, as highlighted `here
<https://github.com/neutronX/django-markdownx/blob/master/markdownx/views.py#L55-L82>`_.

----

Settings
********

You may place any of the variables outlined in this page in your :guilabel:`settings.py`, alter their values and
override default behaviours.

.. attention::
    The focus of this section is on the customisation of features controlled in the **backend**. Additional
    customisations, or to be rather more accurate, **event controls** are enabled in the frontend through JavaScript
    events. To learn more about these events, see our :doc:`JavaScript documentations on events<js/events>`.


Quick Reference
---------------

+------------------------------------------+--------------------------------------------------+------------------------------------------------------------------------+
| Setting variable                         | Default Value                                    | Description                                                            |
+==========================================+==================================================+========================================================================+
| ``MARKDOWNX_MARKDOWNIFY_FUNCTION``       | ``'markdownx.utils.markdownify'``                | Markdown to HTML function.                                             |
|                                          |                                                  | Takes an argument of type ``str()`` and returns the                    |
|                                          |                                                  | HTML encoded output as ``str()``.                                      |
+------------------------------------------+--------------------------------------------------+------------------------------------------------------------------------+
| ``MARKDOWNX_MARKDOWN_EXTENSIONS``        | Empty ``list()``                                 | List of ``str()``. Extensions for the Markdown function.               |
|                                          |                                                  | See `available extensions`_ in Markdown docs.                          |
+------------------------------------------+--------------------------------------------------+------------------------------------------------------------------------+
| ``MARKDOWNX_MARKDOWN_EXTENSION_CONFIGS`` | Empty ``dict()``                                 | Dictionary of configurations for extensions.                           |
|                                          |                                                  | See ``extension_configs`` in `Markdown docs`_.                         |
+------------------------------------------+--------------------------------------------------+------------------------------------------------------------------------+
| ``MARKDOWNX_URLS_PATH``                  | ``'/markdownx/markdownify/'``                    | Relative URL to which the Markdown text is sent to be encoded as HTML. |
+------------------------------------------+--------------------------------------------------+------------------------------------------------------------------------+
| ``MARKDOWNX_UPLOAD_URLS_PATH``           | ``'/markdownx/upload/'``                         | URL that accepts file uploads (images) through AJAX :guilabel:`POST`.  |
|                                          |                                                  | The request response will contain markdown formatted text with         |
|                                          |                                                  | relative URL of the image.                                             |
+------------------------------------------+--------------------------------------------------+------------------------------------------------------------------------+
| ``MARKDOWNX_MEDIA_PATH``                 | ``'markdownx/'``                                 | Where images will be stored in :guilabel:`MEDIA_ROOT` folder.          |
+------------------------------------------+--------------------------------------------------+------------------------------------------------------------------------+
| ``MARKDOWNX_UPLOAD_MAX_SIZE``            | ``50 * 1024 * 1024`` bytes                       | Maximum image size allowed.                                            |
+------------------------------------------+--------------------------------------------------+------------------------------------------------------------------------+
| ``MARKDOWNX_UPLOAD_CONTENT_TYPES``       | ``['image/jpeg', 'image/png', 'image/svg+xml']`` | Enable / disable support for different image formats.                  |
+------------------------------------------+--------------------------------------------------+------------------------------------------------------------------------+
| ``MARKDOWNX_IMAGE_MAX_SIZE``             | ``{ 'size': (500, 500), 'quality': 90 }``        | Maximum image dimension and quality.                                   |
+------------------------------------------+--------------------------------------------------+------------------------------------------------------------------------+
| ``MARKDOWNX_SVG_JAVASCRIPT_PROTECTION``  | ``True``                                         | Monitoring against JavaScript injection in SVG files.                  |
+------------------------------------------+--------------------------------------------------+------------------------------------------------------------------------+
| ``MARKDOWNX_EDITOR_RESIZABLE``           | ``True``                                         | Change editor’s height to match the height of                          |
|                                          |                                                  | the inner contents whilst typing.                                      |
+------------------------------------------+--------------------------------------------------+------------------------------------------------------------------------+
| ``MARKDOWNX_SERVER_CALL_LATENCY``        | ``500`` miliseconds                              | Latency (minimum lag) between server calls as ``int``.                 |
|                                          |                                                  | Minimum allowed: 500 milliseconds.                                     |
+------------------------------------------+--------------------------------------------------+------------------------------------------------------------------------+

Details and examples
--------------------

Looking for a specific feature? see the sidebar for the table of contents.

Markdownify
...........

Default function that compiles markdown using defined extensions. Using custom function can allow you to
pre-process or post-process markdown text. See below for more info.

.. code-block:: python

    MARKDOWNX_MARKDOWNIFY_FUNCTION = 'markdownx.utils.markdownify'

This function uses the `Markdown package`_ for trans-compilation.

.. Note::
    The function name must be entered as string, and the relevant package must be installed and accessible to the
    current interpreter such that it can later be imported as and when needed. So ``markdownx.utils.markdownify``
    essentially means ``from markdownx.utils import markdownify``.

.. Hint::
    The default function (``markdownx.utils.markdownify``) that handles the trans-compilation of Markdown to HTML looks
    like this:

    .. code-block:: python

        from markdown import markdown

        from .settings import (
            MARKDOWNX_MARKDOWN_EXTENSIONS,
            MARKDOWNX_MARKDOWN_EXTENSION_CONFIGS
        )

        def markdownify(content):
            md = markdown(
                text=content,
                extensions=MARKDOWNX_MARKDOWN_EXTENSIONS,
                extension_configs=MARKDOWNX_MARKDOWN_EXTENSION_CONFIGS
            )
            return md

Markdown Extensions
...................

If you wish to extend Markdown functionalities using extensions, you can do so by altering the variables described in
this section. We recommend you read the documentations for the `Markdown package`_, our default Markdown trans-compiler.

.. attention::
    No Markdown extension is enabled by default.

Extensions
``````````
List of Markdown extensions that you would like to use. See below for additional information.
See `available extensions`_ in Markdown docs. For instance, the extension `extra`_ enables features such as
abbreviations, footnotes, tables and so on.

.. code-block:: python

    MARKDOWNX_MARKDOWN_EXTENSIONS = [
        'markdown.extensions.extra'
    ]

Extension configurations
````````````````````````
Configuration object for used markdown extensions. See ``extension_configs`` in `Markdown docs`_. Here is an example:

.. code-block:: python

    MARKDOWNX_MARKDOWN_EXTENSION_CONFIGS = {
        'extension_name_1': {
            'option_1': 'value_1'
        }
    }

Markdown URLs
.............

Relative URL to which the Markdown text is sent to be encoded as HTML.

.. code-block:: python

    MARKDOWNX_URLS_PATH = '/markdownx/markdownify/'

URL that accepts file uploads (images) through an AJAX :guilabel:`POST` request. The request response will contain
markdown formatted markup containing the relative URL for the image.

.. code-block:: python

    MARKDOWNX_UPLOAD_URLS_PATH = '/markdownx/upload/'

Media Path
..........

The path where the images will be stored in your :guilabel:`MEDIA_ROOT` directory.

.. code-block:: python

    MARKDOWNX_MEDIA_PATH = 'markdownx/'

.. tip::
    **Recommended**: Storing all uploaded images in a single directory would over time results in a lot files being
    stored in one location. This would slow down the process of saving and loading files substantially, and can in turn
    lead to your website becoming very slow when it comes to loading images. To address this issue, it is better to
    save the uploads in different directories. Here is an example of how this can be achieved:

    .. code-block:: python

        from datetime import datetime

        MARKDOWNX_MEDIA_PATH = datetime.now().strftime('markdownx/%Y/%m/%d')

    This ensures that uploaded files are stored in a different directory on the basis of the date on which they are
    uploaded. So for instance; an image uploaded on the 15th of April 2017 will be stored
    under ``media/markdownx/2017/4/15/unique_name.png``.

Image Uploads
.............
Maximum size
````````````
Maximum image size allowed in bytes: Default is 50MB, which is equal to 52,428,800 bytes.

.. code-block:: python

    MARKDOWNX_UPLOAD_MAX_SIZE = 50 * 1024 * 1024

.. tip::
    It is considered a good practice to display large numbers in a meaningful way. For instance, 52,438,800 bytes is
    better displayed in code as ``= 50 * 1024 * 1024  # 50 MB in bytes`` instead (the comment is also important).
    Fellow programmers will thank you for this in the future!


Formats
```````
Image formats that the user is permitted to upload.

Options are:

:image/jpeg: Raster graphic JPEG (JPG) images (lossy - with compression).
:image/png: Raster graphic PNG image (lossless - high quality, no compression).
:image/svg+xml: Vector graphic SVG images (scalable and resolution independent, no compression).

.. code-block:: python

    MARKDOWNX_UPLOAD_CONTENT_TYPES = ['image/jpeg', 'image/png', 'image/svg+xml']


Dimension and Quality
`````````````````````
Different options describing final image processing; e.g. dimension and quality.

.. Note::
    Quality restrictions do not apply to ``image/svg+xml`` formatted graphics.

Options are:

:size: (width, height) - When one of the dimensions is set to zero, e.g. ``(500, 0)``,  the height is calculated
       automatically so as to keep the dimensions intact.
:quality: default: `90` – image quality from `0` (full compression) to `100` (no compression).
:crop: default: `False` – if **True**, the `size` is used to crop the image.
:upscale: default: `False` – if image dimensions are smaller than those in defined in `size`, upscale to `size`
          dimensions.


.. code-block:: python

    MARKDOWNX_IMAGE_MAX_SIZE = {
        'size': (500, 500),
        'quality': 90
    }

Security
........
SVG graphics are in essence XML files formatted in a specific way; which means that they can contain JavaScript codes.
This introduces a potential front-end security vulnerability for prospective users who will see the SVG image in
context; e.g. it may be employed to collect the user's IP address or other personal information.

.. Note::
    This type of attack is known as `XSS (Cross-site Scripting) attack`_. See this presentation_
    by Mario Heiderich to learn more on SVG XSS attacks. There are a number of ways to deal with this vulnerability.

    Django is great at security, and provides very good protection against XSS attacks (see the Django documentations_
    for additional information) providing the `CSRF protection middleware`_ is enabled. When it comes to AJAX requests,
    however, CSRF protection may sometimes be disabled for various reasons.


As a last resort, however, we have included an *optional* integrity check against JavaScript tags for SVG
formatted files just in case everything else is disabled. This protection is enabled by default, and may be disabled
by setting the value to ``False`` if so is desired.

.. code-block:: python

    MARKDOWNX_SVG_JAVASCRIPT_PROTECTION = True


.. Important::
    **MarkdownX** does *not* disable CSRF protection by default, and requires the token for all AJAX request.


Editor
......

Change the editor's height to match the height of the inner contents whilst typing:

.. code-block:: python

    MARKDOWNX_EDITOR_RESIZABLE = True


Latency
.......

**Advanced**: When the value of a **MarkdownX** editor is changed, a call is made to the server to trans-compile
Markdown into HTML. However, a minimum latency of **500 milliseconds** has been imposed between the calls. This is to
prevent the bombardment of the server with a huge number of HTTP requests (you don't want to DDoS your own server).
This latency maintains a balance between responsiveness and protection, and is well-suited for medium traffic.
Nonetheless, if your website enjoys a particularly high traffic, you may wish to alter this value slightly depending on
the number of CPUs, the amount memory, and how much you are willing to compromise on responsiveness.

.. code-block:: python

    MARKDOWNX_SERVER_CALL_LATENCY = 500  # milliseconds


.. Attention::
    Any values below 500 milliseconds is silently ignored and replaced.


.. _available extensions: https://pythonhosted.org/Markdown/extensions/index.html#officially-supported-extensions
.. _Markdown docs: https://pythonhosted.org/Markdown/reference.html#markdown
.. _extra: https://pythonhosted.org/Markdown/extensions/extra.html
.. _Markdown package: https://pythonhosted.org/Markdown/
.. _XSS (Cross-site Scripting) attack: https://www.owasp.org/index.php/Cross-site_Scripting_(XSS)
.. _presentation: https://www.owasp.org/images/0/03/Mario_Heiderich_OWASP_Sweden_The_image_that_called_me.pdf
.. _documentations: https://docs.djangoproject.com/en/dev/topics/security/#cross-site-scripting-xss-protection
.. _CSRF protection middleware: https://docs.djangoproject.com/en/dev/ref/middleware/#module-django.middleware.csrf
