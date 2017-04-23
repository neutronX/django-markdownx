Getting Started
===============

1. Add ``'markdownx'`` to the ``INSTALLED_APPS`` in :guilabel:`settings.py` file:

.. code-block:: python

    INSTALLED_APPS = (
        # [...]
        'markdownx',
    )

2. Add url pattern to the :guilabel:`urls.py` file:

.. code-block:: python

    urlpatterns = [
        # [...]
        url(r'^markdownx/', include('markdownx.urls')),
    ]

3. Collect included :guilabel:`markdownx.js` and :guilabel:`markdownx.css` (for Django Admin) to
your :guilabel:`STATIC_ROOT` folder:

.. code-block:: bash

    python3 manage.py collectstatic
