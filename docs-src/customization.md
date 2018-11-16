# Customization

## General (ex. settings)

### Widget

The default widget is as seen [here](https://github.com/neutronX/django-markdownx/blob/master/markdownx/templates/markdownx/widget.html).

If you would like to customise this; for instance, using [Bootstrap v3](https://getbootstrap.com) to implement side-by-side panes (as seen in :doc:`preview animation<index>`), you should override the default widget’s template by creating your own template and saving it under ``markdownx/widget2.html`` (Django 1.11+), or ``markdownx/widget.html`` (Django 1.10 and below) in your project's `TEMPLATE_DIRS`.

!!! note
	In the case of Django 1.11+, you will need to [change the renderer](https://docs.djangoproject.com/en/1.11/ref/forms/renderers/#overriding-built-in-widget-templates) (Django docs) to ``TemplatesSetting``.

Here is an example of the contents:

```html
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
```

### Fields

We have ensured that MarkdownX is fully extensible and provides a high degree of flexibility in development.

There are times that you may wish to Markdownify a different type of field, or utilize your own customized widget. To accommodate this, we have provided the tools to apply MarkdownX infrastructure to other fields through *Widgets*.

For instance, to apply MarkdownX to ``TextField`` instances in your Django Admins, you can override the default widget in the Admins module in `admin.py` of your Django App as follows:

```python
from django.db import models
from django.contrib import admin

from markdownx.widgets import AdminMarkdownxWidget

from .models import MyModel


class MyModelAdmin(admin.ModelAdmin):
    formfield_overrides = {
        models.TextField: {'widget': AdminMarkdownxWidget},
    }


admin.site.register(MyModel, MyModelAdmin)
```

### Image tags

Markdown uses ``![]()`` tag by default to insert uploaded image file. This generates a simple (X)HTML ``<image>`` tag. If you wish to have more control and use your own HTML tags, you may create a custom ``form_valid()`` function in
``ImageUploadView`` class, as highlighted [here](https://github.com/neutronX/django-markdownx/blob/master/markdownx/views.py#L55-L82).

---

## Settings

You may place any of the variables outlined in this page in your `settings.py`, alter their values and override default behaviours:

* [`MARKDOWNX_MARKDOWNIFY_FUNCTION`](#markdownx_markdownify_function)
* [`MARKDOWNX_MARKDOWN_EXTENSIONS`](#markdownx_markdown_extensions)
* [`MARKDOWNX_MARKDOWN_EXTENSION_CONFIGS`](#markdownx_markdown_extension_configs)
* [`MARKDOWNX_URLS_PATH`](#markdownx_urls_path)
* [`MARKDOWNX_UPLOAD_URLS_PATH`](#markdownx_upload_urls_path)
* [`MARKDOWNX_MEDIA_PATH`](#markdownx_media_path)
* [`MARKDOWNX_UPLOAD_MAX_SIZE`](#markdownx_upload_max_size)
* [`MARKDOWNX_UPLOAD_CONTENT_TYPES`](#markdownx_upload_content_types)
* [`MARKDOWNX_IMAGE_MAX_SIZE`](#markdownx_image_max_size)
* [`MARKDOWNX_SVG_JAVASCRIPT_PROTECTION`](#markdownx_svg_javascript_protection)
* [`MARKDOWNX_EDITOR_RESIZABLE`](#markdownx_editor_resizable)
* [`MARKDOWNX_SERVER_CALL_LATENCY`](#markdownx_server_call_latency)

!!! attention
	The focus of this section is on the customisation of features controlled in the **backend**. Additional customisations, or to be rather more accurate, **event controls** are enabled in the frontend through JavaScript events. To learn more about these events, see our [JavaScript documentation on events](javascript.md#events).

---

### `MARKDOWNX_MARKDOWNIFY_FUNCTION`

Default: ``'markdownx.utils.markdownify'``

Markdown to HTML function. Takes an argument of type ``str()`` and returns the HTML encoded output as ``str()``.

Default function that compiles markdown using defined extensions. Using custom function can allow you to pre-process or post-process markdown text. See below for more info.

```python
MARKDOWNX_MARKDOWNIFY_FUNCTION = 'markdownx.utils.markdownify'
```

This function uses the [Markdown package](https://pythonhosted.org/Markdown/) for trans-compilation.

!!! note
	The function name must be entered as string, and the relevant package must be installed and accessible to the current interpreter such that it can later be imported as and when needed. So ``markdownx.utils.markdownify`` essentially means ``from markdownx.utils import markdownify``.

!!! hint
	The default function (``markdownx.utils.markdownify``) that handles the trans-compilation of Markdown to HTML looks like this:

	```python
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
	```

### `MARKDOWNX_MARKDOWN_EXTENSIONS`

Default: empty ``list()``

List of ``str()``. List of Markdown extensions that you would like to use. See [available extensions](https://pythonhosted.org/Markdown/extensions/index.html#officially-supported-extensions) in Markdown docs. For instance, the extension [extra](https://pythonhosted.org/Markdown/extensions/extra.html) enables features such as abbreviations, footnotes, tables and so on.

We recommend you read the documentation for the [Markdown package](https://pythonhosted.org/Markdown/), our default Markdown trans-compiler.

```python
MARKDOWNX_MARKDOWN_EXTENSIONS = [
    'markdown.extensions.extra'
]
```


### `MARKDOWNX_MARKDOWN_EXTENSION_CONFIGS`

Default: empty ``dict()``

Configuration object for used markdown extensions. See ``extension_configs`` in [Markdown docs](https://pythonhosted.org/Markdown/reference.html#markdown). Here is a general idea:

```python
MARKDOWNX_MARKDOWN_EXTENSION_CONFIGS = {
    'extension_name_1': {
        'option_1': 'value_1'
    }
}
```

### `MARKDOWNX_URLS_PATH`

Default: `'/markdownx/markdownify/'`

Relative URL to which the Markdown text is sent to be encoded as HTML.

```python
MARKDOWNX_URLS_PATH = '/markdownx/markdownify/'
```

### `MARKDOWNX_UPLOAD_URLS_PATH`

Default: `'/markdownx/upload/'`

URL that accepts file uploads (images) through an AJAX `POST` request. The request response will contain markdown formatted markup containing the relative URL for the image.

```python
MARKDOWNX_UPLOAD_URLS_PATH = '/markdownx/upload/'
```

### `MARKDOWNX_MEDIA_PATH`

Default: `'markdownx/'`

The path where the images will be stored in your `MEDIA_ROOT` directory.

```python
MARKDOWNX_MEDIA_PATH = 'markdownx/'
```

!!! tip
	**Recommended**: Storing all uploaded images in a single directory would over time results in a lot files being stored in one location. This would slow down the process of saving and loading files substantially, and can in turn lead to your website becoming very slow when it comes to loading images. To address this issue, it is better to save the uploads in different directories. Here is an example of how this can be achieved:

	```python
	from datetime import datetime

    MARKDOWNX_MEDIA_PATH = datetime.now().strftime('markdownx/%Y/%m/%d')
	```

	This ensures that uploaded files are stored in a different directory on the basis of the date on which they are uploaded. So for instance; an image uploaded on the 15th of April 2017 will be stored under ``media/markdownx/2017/4/15/unique_name.png``.

### `MARKDOWNX_UPLOAD_MAX_SIZE`

Default: `50 * 1024 * 1024` bytes

Maximum image size allowed in bytes: Default is 50MB, which is equal to 52,428,800 bytes.

```python
MARKDOWNX_UPLOAD_MAX_SIZE = 50 * 1024 * 1024
```

!!! tip
	It is considered a good practice to display large numbers in a meaningful way. For instance, 52,438,800 bytes is better displayed in code as `= 50 * 1024 * 1024  # 50 MB in bytes` instead (the comment is also important). Fellow programmers will thank you for this in the future!

### `MARKDOWNX_UPLOAD_CONTENT_TYPES`

Default: `['image/jpeg', 'image/png', 'image/svg+xml']`

Image formats that the user is permitted to upload. Enable / disable support for different image formats.

```python
MARKDOWNX_UPLOAD_CONTENT_TYPES = ['image/jpeg', 'image/png', 'image/svg+xml']
```

### `MARKDOWNX_IMAGE_MAX_SIZE`

Default: `{ 'size': (500, 500), 'quality': 90 }`

Different options describing final image processing; e.g. dimension and quality.

!!! note
	Quality restrictions do not apply to `image/svg+xml` formatted graphics.

Options are:

Option | Value | Description
-|-|-
size | `(width,height)` | when one of the dimensions is set to zero, e.g. ``(500, 0)``,  the height is calculated automatically so as to keep the dimensions intact.
quality | `int` | image quality from `0` (full compression) to `100` (no compression). Default: `90`
crop | `Boolean` | if `True`, the `size` is used to crop the image. Default: `False`
upscale | `Boolean` | if image dimensions are smaller than those defined in `size`, upscale to `size` dimensions. Default: `False`


```python
MARKDOWNX_IMAGE_MAX_SIZE = {
    'size': (500, 500),
    'quality': 90
}
```

### `MARKDOWNX_SVG_JAVASCRIPT_PROTECTION`

Default: `True`

SVG graphics are in essence XML files formatted in a specific way; which means that they can contain JavaScript codes. This introduces a potential front-end security vulnerability for prospective users who will see the SVG image in context; e.g. it may be employed to collect the user's IP address or other personal information.

!!! note
	This type of attack is known as [XSS (Cross-site Scripting) attack](https://www.owasp.org/index.php/Cross-site_Scripting_(XSS)). See this [presentation](https://www.owasp.org/images/0/03/Mario_Heiderich_OWASP_Sweden_The_image_that_called_me.pdf) by Mario Heiderich to learn more on SVG XSS attacks. There are a number of ways to deal with this vulnerability.

    Django is great at security, and provides very good protection against XSS attacks (see the Django [documentation](https://docs.djangoproject.com/en/dev/topics/security/#cross-site-scripting-xss-protection) for additional information) providing the [CSRF protection middleware](https://docs.djangoproject.com/en/dev/ref/middleware/#module-django.middleware.csrf) is enabled. When it comes to AJAX requests, however, CSRF protection may sometimes be disabled for various reasons.

As a last resort, however, we have included an *optional* integrity check against JavaScript tags for SVG formatted files just in case everything else is disabled. This protection is enabled by default, and may be disabled by setting the value to ``False`` if so is desired.

```python
MARKDOWNX_SVG_JAVASCRIPT_PROTECTION = True
```

!!! important
	MarkdownX does *not* disable CSRF protection by default, and requires the token for all AJAX request.

### `MARKDOWNX_EDITOR_RESIZABLE`

Default: `True`

Change the editor's height to match the height of the inner contents whilst typing.

```python
MARKDOWNX_EDITOR_RESIZABLE = True
```

### `MARKDOWNX_SERVER_CALL_LATENCY`

Default: `500` miliseconds

Latency (minimum lag) between server calls as `int`. Minimum allowed: 500 milliseconds.

!!! note
	When the value of a MarkdownX editor is changed, a call is made to the server to trans-compile Markdown into HTML. However, a minimum latency of **500 milliseconds** has been imposed between the calls. This is to prevent the bombardment of the server with a huge number of HTTP requests (you don't want to DDoS your own server). This latency maintains a balance between responsiveness and protection, and is well-suited for medium traffic. Nonetheless, if your website enjoys a particularly high traffic, you may wish to alter this value slightly depending on the number of CPUs, the amount memory, and how much you are willing to compromise on responsiveness.

```python
MARKDOWNX_SERVER_CALL_LATENCY = 500  # milliseconds
```

!!! attention
	Any values below 500 milliseconds is silently ignored and replaced.
