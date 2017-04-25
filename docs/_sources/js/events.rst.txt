:github_url: https://github.com/adi-/django-markdownx/tree/master/markdownx/static/markdownx/js


Events
======

Some **MarkdownX** processes trigger events that may be utilized for different purposes. To handle such events in
JavaScript, you may take advantage of event listeners as exemplified below.

----

Quick Reference
---------------

+---------------------+-----------------------------------------+-------------------------------------------------------+
| Event               | JavaScript handler                      | Description                                           |
+=====================+=========================================+=======================================================+
| Initialization      | ``markdownx.init``                      | Triggered after jQuery plugin init.                   |
+---------------------+-----------------------------------------+-------------------------------------------------------+
| Update              | ``markdownx.update``                    | Triggered when editor text is markdownified.          |
|                     |                                         |                                                       |
|                     |                                         | Returns: **response** (*string*)                      |
|                     |                                         |     variable containing markdownified text.           |
+---------------------+-----------------------------------------+-------------------------------------------------------+
| Update error        | ``markdownx.updateError``               | Triggered when a problem occurred during markdownify. |
+---------------------+-----------------------------------------+-------------------------------------------------------+
| Beginning to upload | ``markdownx.markdownx.fileUploadBegin`` | Triggered when the file is posted.                    |
+---------------------+-----------------------------------------+-------------------------------------------------------+
| File upload end     | ``markdownx.fileUploadEnd``             | Triggered when the file has been uploaded.            |
+---------------------+-----------------------------------------+-------------------------------------------------------+
| File upload error   | ``markdownx.fileUploadError``           | Triggered if the upload didn't work.                  |
+---------------------+-----------------------------------------+-------------------------------------------------------+


----

Examples
--------

Initialization
    ``markdownx.init`` is an event that does *not* return a response.

JavaScript ECMA 2015+:

.. code-block:: javascript
    :linenos:

    let element = document.getElementsByClassName('markdownx');

    Object.keys(element).map(key =>

        element[key].addEventListener('markdownx.init', () => console.log("MarkdownX initialized."))

    );


Update
    ``markdownx.update`` is an event that returns a response.

JavaScript ECMA 2015+:

.. code-block:: javascript
    :linenos:

    let element = document.getElementsByClassName('markdownx');

    Object.keys(element).map(key =>

        element[key].addEventListener('markdownx.update', event => console.log(event.detail))

    );
