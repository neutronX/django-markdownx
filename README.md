# django-markdownx [![Version](https://img.shields.io/pypi/v/django-markdownx.svg)](https://pypi.python.org/pypi/django-markdownx/)

[![Status](https://img.shields.io/pypi/status/django-markdownx.svg)](https://pypi.python.org/pypi/django-markdownx/)
[![Travis](https://img.shields.io/travis/adi-/django-markdownx.svg)](https://travis-ci.org/adi-/django-markdownx)
[![Format](https://img.shields.io/pypi/format/django-markdownx.svg)](https://pypi.python.org/pypi/django-markdownx/)
[![Python Versions](https://img.shields.io/pypi/pyversions/django-markdownx.svg)](https://pypi.python.org/pypi/django-markdownx/)
[![Django Versions](https://img.shields.io/badge/Django-1.8,%201.9,%201.10,%201.11-green.svg)](https://www.djangoproject.com/)
[![License](https://img.shields.io/pypi/l/django-markdownx.svg)](https://pypi.python.org/pypi/django-markdownx/)

#### Key features

* raw editing
* live preview
* drag&drop image uploads (stored locally in `MEDIA` folder)
* customizable image insertion tag
* image filtering using content types and max file size
* image manipulations (compression, size, cropping, upscaling)
* pre-&post- text altering
* easy template customization for layout purposes
* multiple editors on one page
* Django Admin support

#### Preview

![Preview](https://github.com/adi-/django-markdownx/blob/master/django-markdownx-preview.gif?raw=true "Preview")

<sup>*(using Bootstrap for layout and styling)*</sup>


# Menu

* [Quick Start](#quick-start)
* [Usage](#usage)
    * [Model](#model)
    * [Form](#form)
    * [Django Admin](#django-admin)
* [Customization](#customization)
    * [Settings](#settings)
    * [Widget's custom template](#widgets-custom-template)
    * [Custom image insertion tag](#custom-image-insertion-tag)
* [JS events](#js-events)
* [Dependencies](#dependencies)
* [License](#license)
* [Package Requests](#package-requests)
* [Notes](#notes)


# Quick Start

1. Install `django-markdownx` package.

    ```bash
    pip install django-markdownx
    ```


1. Add `markdownx` to your `INSTALLED_APPS`.

    ```python
    #settings.py
    INSTALLED_APPS = (
        [...]
        'markdownx',
    )
    ```

1. Add url pattern to your `urls.py`.

    ```python
    #urls.py
    urlpatterns = [
        [...]
        url(r'^markdownx/', include('markdownx.urls')),
    ]
    ```

1. Collect included `markdownx.js` and `markdownx.css` (for django admin styling) to your `STATIC_ROOT` folder.

    ```bash
    python manage.py collectstatic
    ```

1. ...and don't forget to include jQuery in your html file.

    ```html
    <head>
        [...]
        <script src="//code.jquery.com/jquery-2.1.1.min.js"></script>
    </head>
    ```

# Usage

## Model

```python
#models.py
from markdownx.models import MarkdownxField

class MyModel(models.Model):

    myfield = MarkdownxField()
```

...and then, include a form's required media in the template using `{{ form.media }}`:

```html
<form method="POST" action="">{% csrf_token %}
    {{ form }}
</form>
{{ form.media }}
```

## Form

```python
#forms.py
from markdownx.fields import MarkdownxFormField

class MyForm(forms.Form):

    myfield = MarkdownxFormField()
```

...and then, include a form's required media in the template using `{{ form.media }}`:

```html
<form method="POST" action="">{% csrf_token %}
    {{ form }}
</form>
{{ form.media }}
```

## Django Admin

When using included `MarkdowxModel` class in your models, just use `MarkdownxModelAdmin` as follows:

```python
#admin.py
from django.contrib import admin

from markdownx.admin import MarkdownxModelAdmin

from .models import MyModel

admin.site.register(MyModel, MarkdownxModelAdmin)
```

However, when you want to use `markdownx` with other classes – lets say `TextField` – than override default widget as follows:

```python
#admin.py
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


# Customization

## Settings

Place settings in your `settings.py` to override default values:

```python
#settings.py

# Markdownify
MARKDOWNX_MARKDOWNIFY_FUNCTION = 'markdownx.utils.markdownify' # Default function that compiles markdown using defined extensions. Using custom function can allow you to pre-process or post-process markdown text. See below for more info.

# Markdown extensions
MARKDOWNX_MARKDOWN_EXTENSIONS = [] # List of used markdown extensions. See below for more info.
MARKDOWNX_MARKDOWN_EXTENSION_CONFIGS = {} # Configuration object for used markdown extensions

# Markdown urls
MARKDOWNX_URLS_PATH = '/markdownx/markdownify/' # URL that returns compiled markdown text.
MARKDOWNX_UPLOAD_URLS_PATH = '/markdownx/upload/' # URL that accepts file uploads, returns markdown notation of the image.

# Media path
MARKDOWNX_MEDIA_PATH = 'markdownx/' # Path, where images will be stored in MEDIA_ROOT folder

# Image
MARKDOWNX_UPLOAD_MAX_SIZE = 52428800 # 50MB - maximum file size
MARKDOWNX_UPLOAD_CONTENT_TYPES = ['image/jpeg', 'image/png', 'image/svg+xml'] # Acceptable file content types
MARKDOWNX_IMAGE_MAX_SIZE = {'size': (500, 500), 'quality': 90,} # Different options describing final image processing: size, compression etc. See below for more info. Dimensions are not applied to SVG files.

# Editor
MARKDOWNX_EDITOR_RESIZABLE = True # Update editor's height to inner content height while typing
```

#### MARKDOWNX_MARKDOWNIFY_FUNCTION

Default function that compiles markdown looks like:

```python
# utils.py
import markdown

from .settings import MARKDOWNX_MARKDOWN_EXTENSIONS, MARKDOWNX_MARKDOWN_EXTENSION_CONFIGS

def markdownify(content):
    return markdown.markdown(content, extensions=MARKDOWNX_MARKDOWN_EXTENSIONS, extension_configs=MARKDOWNX_MARKDOWN_EXTENSION_CONFIGS)
```


#### MARKDOWNX_MARKDOWN_EXTENSIONS

```python
#settings.py
MARKDOWNX_MARKDOWN_EXTENSIONS = [
    'markdown.extensions.extra',
    'markdown.extensions.nl2br',
    'markdown.extensions.smarty',
]
```

*Visit [https://pythonhosted.org/Markdown/extensions/index.html](https://pythonhosted.org/Markdown/extensions/index.html) to read more about markdown extensions*.

#### MARKDOWNX_IMAGE_MAX_SIZE

Dict properties:

* **size** – (width, height). When `0` used, i.e.: (500,0),  property will figure out proper height by itself
* **quality** – default: `90` – image quality, from `0` (full compression) to `100` (no compression)
* **crop** – default: `False` – if `True`, use `size` to crop final image
* **upscale** – default: `False` – if image dimensions are smaller than those in `size`, upscale image to `size` dimensions


## Widget's custom template

Default widget's template looks like:

```html
<div class="markdownx">
    {{ markdownx_editor }}
    <div class="markdownx-preview"></div>
</div>
```

When you want to use Bootstrap 3 and side-by-side panes (as in preview image above), just place `markdownx/widget.html` file in your project's 'TEMPLATE_DIRS' folder with:

```html
<div class="markdownx row">
    <div class="col-md-6">
        {{ markdownx_editor }}
    </div>
    <div class="col-md-6">
        <div class="markdownx-preview"></div>
    </div>
</div>
```

## Custom image insertion tag

Markdown uses `![]()` syntax to insert uploaded image file. This generates very simple html `<image>` tag. When you want to have more control and use your own html tags just create custom `form_valid()` function in `ImageUploadView` class.

Default `ImageUploadView` class looks like:

```python
#views.py
from django.http import JsonResponse
from django.views.generic.edit import FormView

from .forms import ImageForm

class ImageUploadView(FormView):

    template_name = "dummy.html"
    form_class = ImageForm
    success_url = '/'

    def form_invalid(self, form):
        response = super(ImageUploadView, self).form_invalid(form)
        if self.request.is_ajax():
            return JsonResponse(form.errors, status=400)
        else:
            return response

    def form_valid(self, form):
        image_path = form.save()
        response = super(ImageUploadView, self).form_valid(form)

        if self.request.is_ajax():
            image_code = '![]({})'.format(image_path)
            return JsonResponse({'image_code': image_code})
        else:
            return response
```



# JS events

Each markdownx jQuery object triggers these basic events:

* `markdownx.init` – is triggered after jQuery plugin init
* `markdownx.update` – is triggered when editor text is markdownified. Returns `response` variable containing markdownified text.
* `markdownx.update_error` – is triggered when a problem occured during markdownify.
* `markdownx.file_upload_begin` – is triggered when the file is posted.
* `markdownx.file_upload_end` – is triggered when the file has been uploaded.
* `markdownx.file_upload_error` – is triggered if the upload didn't work.

To handle events in JS use:

```js
$('.markdownx').on('markdownx.init', function() {
    console.log("init");
});

$('.markdownx').on('markdownx.update', function(e, response) {
    console.log("update " + response);
});

$('.markdownx').on('markdownx.update_error', function(e) {
    console.log("update error");
});

$('.markdownx').on('markdownx.file_upload_begin', function(e) {
    console.log("Uploading has started.");
});

$('.markdownx').on('markdownx.file_upload_end', function(e) {
    console.log("Uploading has ended.");
});

$('.markdownx').on('markdownx.file_upload_error', function(e) {
    console.log("Error during file upload");
});

```


# Dependencies

* Markdown
* Pillow
* Django
* jQuery


# License

django-markdown is licensed under the open source BSD license. Read `LICENSE` file for details.


# Package requests

It would be nice if anyone could support this project by adding missing functionality:

* tests
* JS intelligent auto-scrolling when side-by-side panes used


# Notes

**django-markdownx** was inspired by great [django-images](https://github.com/mirumee/django-images) and [django-bootstrap-markdown](https://github.com/aj-may/django-bootstrap-markdown) packages.
