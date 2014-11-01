[![Latest Version](https://pypip.in/v/django-markdownx/badge.png)](https://pypi.python.org/pypi/django-markdownx/)
[![Downloads](https://pypip.in/d/django-markdownx/badge.png?period=month)](https://pypi.python.org/pypi/django-markdownx/)
[![License](https://pypip.in/license/django-markdownx/badge.png)](https://pypi.python.org/pypi/django-markdownx/)

# django-markdownx

Django Markdownx is a markdown editor built for Django.

It is simply an extension of the Django's Textarea widget made for editing Markdown with a live preview. It also supports uploading images with drag&drop functionality and auto tag insertion. Preview pane is rendered with [Marked](https://github.com/chjj/marked) – JS Markdown compiler.

## Quick Start

1. Install *django-markdownx* package

	```python
	pip install django-markdownx
	```


1. Add *markdownx* to your *INSTALLED_APPS*

	```python
	INSTALLED_APPS = (
	    [...]
	    'markdownx',
	```
            
1. Add *url* pattern to your *urls.py*

	```python
	urlpatterns = [
	   	[...]
	    url(r'^markdownx/', include('markdownx.urls')),
	]
	```

1. Use *MarkdownxInput* widget in your *forms.py*

	```python
	from django import forms
	from markdownx.widgets import MarkdownxInput
	
	class MyForm(forms.ModelForm):
	   	content = forms.CharField(widget=MarkdownxInput)
	```
    	
1. Use *manage.py collectstatic*

	Use `manage.py collectstatic` to copy files:
	
		static/css/markdownx.css
		static/js/markdown.js

1. Include *[jquery](http://jquery.com)* and *[marked.js](https://github.com/chjj/marked)* files

	```html
	<head>
		[...]
		<script src="{{ STATIC_URL }}js/jquery.js"></script>
		<script src="{{ STATIC_URL }}js/marked.js"></script>
	</head>
	```
 	
    	
# Settings

```python
#settings.py
MARKDOWNX_MEDIA_PATH = 'markdownx/' # subdirectory, where images will be stored in MEDIA_ROOT folder
MARKDOWNX_MAX_UPLOAD_SIZE = 52428800 # 50MB
MARKDOWNX_CONTENT_TYPES = ['image/jpeg', 'image/png']
MARKDOWNX_IMAGE_SIZE = {'size': (500, 500), 'quality': 90,}
```

MARKDOWNX_IMAGE_SIZE dict properties:

* **size** – (width, height). When `0` used, property will figure out proper value by itself
* **quality** – default: `None` – image quality, from `0` (full compression) to `100` (no compression)
* **crop** – default: `False` – if `True` use `size` to crop final image
* **upscale** – default: `False` – if image dimensions are smaller than those in `size` upscale image to `size` dimensions

# Template

Default template looks like:

```html
<div id="markdownx">
    <h6>{% trans "Editor" %}</h6>
    {{ editor }}
    <h6>{% trans "Preview" %}</h6>
    <div id="markdownx_preview"></div>
</div>
```
	
It is easy customizable, i.e. when you want to use Bootstrap 3 and "real" side-by-side panes. Just place `templates/markdownx/widget.html` file with:

```html
<div class="row" id="markdownx">
    <div class="col-sm-6">
        <h6>{% trans "Editor" %}</h6>
        {{ editor }}
    </div>
    <div class="col-sm-6">
        <h6>{% trans "Preview" %}</h6>
        <div id="markdownx_preview"></div>
    </div>
</div>
```

# Dependencies

* Pillow – for image manipulations on upload

# TODO

* use whatever JS markdown compiler
* custom URL upload link
* tests


# Changelog

### v0.1.0

* init

# Notes

**django-markdownx** was inspired by great [django-images](https://github.com/mirumee/django-images) and [django-bootstrap-markdown](http://thegoods.aj7may.com/django-bootstrap-markdown/) packages.