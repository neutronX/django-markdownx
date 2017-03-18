JavaScript
==========

.. toctree::
    :maxdepth: 2
    :glob:

    *

----

Compatibility
-------------

We rely on JavaScript to handle front-end events (e.g. trans-compilation of Markdown to HTML, uploading image).

.. Note::
    **MarkdownX** currently supports browsers compatible with :guilabel:`ECMAScript 5` (approved in 2011), which
    includes all major browsers (see the details on `browser compatibilities`_).


JQuery
------
Our JavaScript infrastructure relies heavily on `JQuery`_, and as such, it is essential that :guilabel:`JQuery 2.1` or
later is included inside the ``<head>`` element of any pages in which **MarkdownX** fields are used.

.. Tip::
    You can include JQuery in your template by copying and pasting one of the links provided by `Google Developers`_
    content delivery network (CDN) in your template.


.. Note::
    Django Admin includes JQuery by default. See `Django documentations`_ for additional information.


.. _Django documentations: https://docs.djangoproject.com/en/dev/internals/contributing/writing-code/javascript/#javascript-patches
.. _JQuery: https://jquery.com
.. _Google Developers: https://developers.google.com/speed/libraries/#jquery
.. _browser compatibilities: https://kangax.github.io/compat-table/es5/