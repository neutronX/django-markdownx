# django-markdownx [![Version](https://img.shields.io/pypi/v/django-markdownx.svg)](https://pypi.python.org/pypi/django-markdownx/)

[![Travis](https://img.shields.io/travis/adi-/django-markdownx.svg)](https://travis-ci.org/adi-/django-markdownx)
[![Python Versions](https://img.shields.io/pypi/pyversions/django-markdownx.svg)](https://pypi.python.org/pypi/django-markdownx/)
[![Status](https://img.shields.io/pypi/status/django-markdownx.svg)](https://pypi.python.org/pypi/django-markdownx/)
[![Downloads](https://img.shields.io/pypi/dm/django-markdownx.svg)](https://pypi.python.org/pypi/django-markdownx/)
[![License](https://img.shields.io/pypi/l/django-markdownx.svg)](https://pypi.python.org/pypi/django-markdownx/)

Django Markdownx is a Markdown editor built for Django. It enables raw editing, live preview and image uploads (stored locally in `MEDIA` folder) with drag&drop functionality and auto tag insertion.

![Preview](https://github.com/adi-/django-markdownx/blob/master/django-markdownx-preview.gif?raw=true "Preview")

<sup>*(using Bootstrap for layout and styling)*</sup>

Template is highly customizable, so you can easily use i.e. Bootstrap to layout editor pane and preview pane side by side. Using multiple editors on one page is supported.

*Side note: Just to keep it simple, all UI editing controls are unwelcome – this is Markdown editor not a web MS Word imitation.*


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
* [Changelog](#changelog)
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
MARKDOWNX_UPLOAD_CONTENT_TYPES = ['image/jpeg', 'image/png'] # Acceptable file content types
MARKDOWNX_IMAGE_MAX_SIZE = {'size': (500, 500), 'quality': 90,} # Different options describing final image processing: size, compression etc. See below for more info.

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

Each markdownx jQuery object triggers two basic events:

* 'markdownx.init'
* 'markdownx.update' – also returns 'response' variable containing markdownified text

```js
$('.markdownx').on('markdownx.init', function() {
	console.log("INIT");
});

$('.markdownx').on('markdownx.update', function(e, response) {
	console.log("UPDATE" + response);
});
```


# Dependencies

* Markdown
* Pillow
* Django
* jQuery

# Changelog

###### v1.6.1

* Template render syntax fix

###### v1.6

* Support for Django's `default_storage`
* Fix for missing MARKDOWNX_MARKDOWNIFY_FUNCTION in settings


###### v1.5

* Possibility to customize image insertion code

###### v1.4.3

* Markdown abstractable function fix

###### v1.4.2

* Maintenance release

###### v1.4.1

* Make rendering the markdown abstractable

###### v1.4

* Added JS (jQuery) events
* Custom upload url path
* Fix when subclassing MarkdownxWidget

###### v1.3

* Added Markdown extension configuration setting

###### v1.2.1

* Fix by Eduard Sukharev: Fix accessing file length in python3

###### v1.2

* Added custom url path setting MARKDOWNX_URLS_PATH to compile markdown with custom view (i.e. for pre/post altering markdown text)

###### v1.1.3

* Setup tools fix

###### v1.1.2

* Critical fix for image upload

###### v1.1.1

* Package fix

###### v1.1

* Python 3.3+ support
* Very simple test added just to test python 3 support

###### v1.0.1

* Moved html logic from FormField to Widget to be able to override model objects other than included MarkdownxModel
* Fixed default value for `MARKDOWNX_EDITOR_RESIZABLE`

###### v1.0.0

* Warning: no backward compatibility
* Admin, Model and Form custom objects
* Django admin styles for compiled markdown
* Settings variables changed:
    * MARKDOWNX_MAX_SIZE => MARKDOWNX_IMAGE_MAX_SIZE
    * MARKDOWNX_MARKDOWN_KWARGS => MARKDOWNX_MARKDOWN_EXTENSIONS
    * MARKDOWNX_MAX_UPLOADSIZE => MARKDOWNX_UPLOAD_MAX_SIZE
    * MARKDOWNX_CONTENT_TYPES => MARKDOWNX_UPLOAD_CONTENT_TYPES

###### v0.4.2

* Path fix by argaen

###### v0.4.1

* Better editor height updates
* Refresh preview on image upload
* Small JS code fixes

###### v0.4.0

* editor auto height

###### v0.3.1

* JS event fix

###### v0.3.0

* version bump

###### v0.2.9

* Removed any inlcuded css
* Removed JS markdown compiler (full python support now with Markdown lib)

###### v0.2.0

* Allow to paste tabs using Tab button

###### v0.1.4

* package data fix

###### v0.1.3

* README.md fix on PyPi

###### v0.1.2

* critical setuptools fix

###### v0.1.1

* change context name `editor` to `markdownx_editor` for better consistency

###### v0.1.0

* init


# License

django-markdown is licensed under the open source BSD license. Read `LICENSE` file for details.


# Package requests

It would be nice if anyone could support this project by adding missing functionality:

* tests
* JS intelligent auto-scrolling when side-by-side panes used


# Notes

**django-markdownx** was inspired by great [django-images](https://github.com/mirumee/django-images) and [django-bootstrap-markdown](http://thegoods.aj7may.com/django-bootstrap-markdown/) packages.
