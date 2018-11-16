# Getting Started

First and foremost, add ``markdownx`` to the list of ``INSTALLED_APPS`` in `settings.py`.

```python
INSTALLED_APPS = (
	# [...]
	'markdownx',
)
```

You may alter default behaviours by adding and changing relevant variables in your settings. See [customization](customization.md) for additional information.

Add MarkdownX URL patterns to your `urls.py`. You can do this using either of these methods depending on your style:

```python
urlpatterns = [
	# [...]
	url(r'^markdownx/', include('markdownx.urls')),
]
```

or alternatively:

```python
from django.conf.urls import url, include
from markdownx import urls as markdownx

urlpatterns += [
    url(r'^markdownx/', include(markdownx))
]
```

!!! caution
	Don't forget to collect MarkdownX assets to your `STATIC_ROOT`. To do this, run:

	```python
	python3 manage.py collectstatic
	```

    Replace ``python3`` with the your interpreter of choice.
