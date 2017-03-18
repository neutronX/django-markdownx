Events
======

Each **MarkdownX** jQuery object triggers a number of basic events. To handle events in JavaScript, you may
take advantage of events listeners.

Events Reference
----------------

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

.. Note::
    All examples use JQuery event listeners.


Initialization
    ``markdownx.init``

.. code-block:: javascript
    :linenos:

    $('.markdownx').on('markdownx.init', function() {

        console.log("init");

    });


Update
    ``markdownx.update``

.. code-block:: javascript
    :linenos:

    $('.markdownx').on('markdownx.update', function(e, response) {

        console.info("Update " + response);

    });


Update error
    ``markdownx.updateError``

.. code-block:: javascript
    :linenos:

    $('.markdownx').on('markdownx.updateError', function(e) {

        console.error("Update error.");

    });


Beginning to upload
    ``markdownx.fileUploadBegin``

.. code-block:: javascript
    :linenos:

    $('.markdownx').on('markdownx.fileUploadBegin', function(e) {

        console.log("Uploading has started.");

    });


File upload end
    ``markdownx.fileUploadEnd``

.. code-block:: javascript
    :linenos:

    $('.markdownx').on('markdownx.fileUploadEnd', function(e) {

        console.log("Uploading has ended.");

    });


File upload error
    ``markdownx.fileUploadError``

.. code-block:: javascript
    :linenos:

    $('.markdownx').on('markdownx.fileUploadError', function(e) {

        console.error("Error during file upload.");

    });