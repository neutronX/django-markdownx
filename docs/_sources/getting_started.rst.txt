Getting Started
===============

1. First and foremost, add ``markdownx`` to the list of ``INSTALLED_APPS`` in :guilabel:`settings.py`.

.. code-block:: python

    INSTALLED_APPS = (
        # [...]
        'markdownx',
    )


You may alter default behaviours by adding and changing relevant variables in your settings. See
:doc:`customization <customization>` for additional information.

2. Add MarkdownX URL patterns to your :guilabel:`urls.py`.

You can do this using either of these methods depending on your style:

.. code-block:: python

    urlpatterns = [
        [...]
        url(r'^markdownx/', include('markdownx.urls')),
    ]

or alternatively:

.. code-block:: python
    :linenos:

    from django.conf.urls import url, include
    from markdownx import urls as markdownx

    urlpatterns += [
        url(r'^markdownx/', include(markdownx))
    ]


.. Important::
    Don't forget to collect MarkdownX assets to your :guilabel:`STATIC_ROOT`. To do this, run:

    .. code-block:: bash

        python3 manage.py collectstatic

    Replace ``python3`` with the your interpreter of choice.