[![Downloads](https://pypip.in/d/django-markdownx/badge.svg?period=month&style=flat)](https://pypi.python.org/pypi/django-markdownx/)
[![Latest Version](https://pypip.in/v/django-markdownx/badge.svg?style=flat)](https://pypi.python.org/pypi/django-markdownx/)
[![License](https://pypip.in/license/django-markdownx/badge.svg?style=flat)](https://pypi.python.org/pypi/django-markdownx/)

# django-markdownx

Django Markdownx is a markdown editor built for Django.

It is simply an extension of the Django's Textarea widget made for editing Markdown with a live preview. It also supports uploading images with drag&drop functionality and auto tag insertion. Preview pane is rendered (for now only) with [Marked](https://github.com/chjj/marked) – JS Markdown compiler.

## Quick Start

1. Install *django-markdownx* package

	```python
	pip install django-markdownx
	```


1. Add *markdownx* to your *INSTALLED_APPS*

	```python
	#settings.py
	INSTALLED_APPS = (
	    [...]
	    'markdownx',
	```
            
1. Add *url* pattern to your *urls.py*

	```python
	#urls.py
	urlpatterns = [
	   	[...]
	    url(r'^markdownx/', include('markdownx.urls')),
	]
	```

1. Use *MarkdownxInput* widget in your *forms.py*

	```python
	#forms.py
	from django import forms
	from markdownx.widgets import MarkdownxInput
	
	class MyForm(forms.ModelForm):
	   	content = forms.CharField(widget=MarkdownxInput)
	```
    	
1. Collect included static files

	Use `manage.py collectstatic` to copy those files:
	
		static/css/markdownx.css
		static/js/markdownx.js

1. Include *[jQuery](http://jquery.com)* and *[Marked](https://github.com/chjj/marked)* files

	```html
	<head>
		[...]
		<script src="{{ STATIC_URL }}js/jquery.js"></script>
		<script src="{{ STATIC_URL }}js/marked.js"></script>
	</head>
	```
 	
    	
# Settings

Place settings in your *settings.py* to override default values:

```python
#settings.py
MARKDOWNX_MEDIA_PATH = 'markdownx/' # subdirectory, where images will be stored in MEDIA_ROOT folder
MARKDOWNX_MAX_UPLOAD_SIZE = 52428800 # 50MB
MARKDOWNX_CONTENT_TYPES = ['image/jpeg', 'image/png']
MARKDOWNX_IMAGE_SIZE = {'size': (500, 500), 'quality': 90,}
```

*MARKDOWNX_IMAGE_SIZE* dict properties:

* **size** – (width, height). When `0` used, i.e.: (500,0),  property will figure out proper height by itself
* **quality** – default: `None` – image quality, from `0` (full compression) to `100` (no compression)
* **crop** – default: `False` – if `True` use `size` to crop final image
* **upscale** – default: `False` – if image dimensions are smaller than those in `size`, upscale image to `size` dimensions

# Template

Default template looks like:

```html
<div id="markdownx">
    <h6>{% trans "Editor" %}</h6>
    {{ markdownx_editor }}
    <h6>{% trans "Preview" %}</h6>
    <div id="markdownx_preview"></div>
</div>
```
	
It is easy customizable, i.e. when you want to use Bootstrap 3 and "real" side-by-side panes. Just place `templates/markdownx/widget.html` file with:

```html
<div class="row" id="markdownx">
    <div class="col-sm-6">
        <h6>{% trans "Editor" %}</h6>
        {{ markdownx_editor }}
    </div>
    <div class="col-sm-6">
        <h6>{% trans "Preview" %}</h6>
        <div id="markdownx_preview"></div>
    </div>
</div>
```

# Dependencies

* jQuery – AJAX upload and JS functionality
* Marked.js – markdown compiler

# TODO

* use whatever JS markdown compiler
* custom URL upload link
* custom media path function
* tests
* python 3 compatibility


# Changelog

### v0.1.2

* critical setuptools fix

### v0.1.1

* change context name `editor` to `markdownx_editor` for better consistency

### v0.1.0

* init

# Notes

**django-markdownx** was inspired by great [django-images](https://github.com/mirumee/django-images) and [django-bootstrap-markdown](http://thegoods.aj7may.com/django-bootstrap-markdown/) packages.