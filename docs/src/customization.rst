Customization
=============


Settings
--------

.. code-block:: python

    INSTALLED_APPS = (
        # [...]
        'markdownx',
    )


You may place and alter any of you the variables as follows in your :guilabel:`settings.py` to override default
behaviours.

----

Customization
-------------

All customizations concerning the back-end behaviour of **MarkdownX** may be applied from the :guilabel:`settings.py`
file.

Markdownify
...........
Default function that compiles markdown using defined extensions. Using custom function can allow you to
pre-process or post-process markdown text. See below for more info.

.. code-block:: python

    MARKDOWNX_MARKDOWNIFY_FUNCTION = 'markdownx.utils.markdownify'

Markdown Extensions
...................

List of Markdown extensions that you would like to use. See below for additional information.

.. code-block:: python

    MARKDOWNX_MARKDOWN_EXTENSIONS = []


Configuration object for used markdown extensions.

.. code-block:: python

    MARKDOWNX_MARKDOWN_EXTENSION_CONFIGS = {}

Markdown URLs
.............

URL that trans-compiles the Markdown text and returns HTML.

.. code-block:: python

    MARKDOWNX_URLS_PATH = '/markdownx/markdownify/'

URL that accepts file uploads (images) and returns markdown formatted text for the image.

.. code-block:: python

    MARKDOWNX_UPLOAD_URLS_PATH = '/markdownx/upload/'

Media Path
..........

Path, where images will be stored in :guilabel:`MEDIA_ROOT` folder.

.. code-block:: python

    MARKDOWNX_MEDIA_PATH = 'markdownx/'

Image
.....

Maximum image size allowed in bytes: Default is 50MB, which is equal to 52,428,800 bytes.

.. tip::
    It is considered a good practice to display large numbers in a meaningful way. For instance, 52,438,800 bytes is
    better displayed in code as ``= 50 * 1024 * 1024  # 50 MB in bytes`` instead.

.. code-block:: python

    MARKDOWNX_UPLOAD_MAX_SIZE = 50 * 1024 * 1024

Acceptable file content types (image formats):


.. code-block:: python

    MARKDOWNX_UPLOAD_CONTENT_TYPES = ['image/jpeg', 'image/png', 'image/svg+xml']

Different options describing final image processing; e.g. size and compression.

.. Note::
    Quality restrictions do not apply to ``image/svg+xml`` formatted graphics.

.. code-block:: python

    MARKDOWNX_IMAGE_MAX_SIZE = {'size': (500, 500), 'quality': 90,}

Security
........
SVG graphics are in essence XML files formatted in a specific way; which means that they can contain JavaScript codes.
This introduces a potential front-end security vulnerability for prospective users who will see the SVG image in
context; e.g. it may be employed to collect the user's IP address or other personal information.

.. Note::
    This type of attack is known as `XSS (Cross-site
    Scripting) attack <https://www.owasp.org/index.php/Cross-site_Scripting_(XSS)>`_.
    See `this presentation <https://www.owasp.org/images/0/03/Mario_Heiderich_OWASP_Sweden_The_image_that_called_me.pdf>`_
    by Mario Heiderich to learn more on SVG XSS attacks. There are a number of ways to deal with this vulnerability.

    Django is great at security, and provides very good protection against XSS attacks (see the
    `documentations <https://docs.djangoproject.com/en/dev/topics/security/#cross-site-scripting-xss-protection>`_ for
    additional information) providing the
    `CSRF protection middleware <https://docs.djangoproject.com/en/dev/ref/middleware/#module-django.middleware.csrf>`_
    is enabled. When it comes to AJAX requests, however, CSRF protection may sometimes be disabled for various reasons.

.. Important::
    MarkdownX does *not* disable CSRF protection by default.


As a last resort, however, we have included an *optional* integrity check against JavaScript tags for SVG
formatted files just in case everything else is disabled. This protection is enabled by default, and may be disabled
by setting the value to ``False`` if so is desired.

.. code-block:: python

    MARKDOWNX_SVG_JAVASCRIPT_PROTECTION = True

Editor
......

Change the editor's height to match the height of the inner contents whilst typing:

.. code-block:: python

    MARKDOWNX_EDITOR_RESIZABLE = True
