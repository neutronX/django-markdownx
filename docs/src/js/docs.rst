:github_url: https://github.com/adi-/django-markdownx/tree/master/markdownx/static/markdownx/js

JavaScript Code
---------------

.. js:function:: getCookie(name)

    Looks for a cookie, and if found, returns the values.

    .. Note::

        Only the first item in the array is returned to eliminate the need for array deconstruction
        in the target.

    .. Attention::

        The function catches the **TypeError** and returns ``null`` if the ``name`` provided for the cookie is not
        found. A notification is then provided in the console to inform the developer that the requested cookie does
        not exist.

    :param string name: The name of the cookie.
        :returns: Value of the cookie with the key ``name`` or ``null``.


.. js:function:: preparePostData(data)

    Creates a new instance of **FormData** to be used in AJAX calls.

    :param Object data: Data to be embedded in the form in **JSON** format, where the *key* is the name/ID of the field
                        whose values are to be altered/created and corresponds to ``dict`` keys in Django
                        ``request.POST``.

    :param Boolean csrf: If ``true``, includes the CSRF token (under the name ``csrfmiddlewaretoken``) in the form.
                         Default is ``true``.

    :returns: A new instance **FormData** that incorporated the data embedded in ``data`` and the CSRF token in enabled.
    :return type: FormData


.. js:class:: MarkdownX(editor, preview)

    :param HTMLTextAreaElement editor: Markdown editor element.
    :param HTMLElement preview: Markdown preview element.

    .. js:attribute:: editor

        (*HTMLTextAreaElement*) Instance editor.

    .. js:attribute:: preview

        (*HMTLElement*) Instance preview.

    .. js:attribute:: timeout

        (*number* | *null*) Private property; timeout settings.

    .. js:attribute:: _editorIsResizable

        (*Boolean*) Private property; ``true`` if instance editor is resizable, otherwise ``false``.

    .. js:function:: getEditorHeight(editor)

        :param HTMLTextAreaElement editor: Markdown editor element.
        :returns: The editor's height in pixels; e.g. ``"150px"``.
        :return type: string


    .. js:function:: _markdownify()

        Private settings for ``timeout``.

    .. js:function:: _routineEventResponse()

        Private routine tasks for event handlers (e.g. default preventions).

    .. js:function:: inputChanged()

        Event handlers in response to alterations in the instance editor.

    .. js:function:: onDragEnter()

        Event handler for :guilabel:`dragEnter` events.

    .. js:function:: onDragLeave()

        Event handler for :guilabel:`dragLeave` events.

    .. js:function:: onDrop()

        Event handler for :guilabel:`drop` events (in drag and drops).

    .. js:function:: onKeyDown()

        Event handler for :guilabel:`keyDown` events as registered in the instance editor.

    .. js:function:: sendFile()

        pass

    .. js:function:: getMarkdown()

        pass

    .. js:function:: insertImage()

        pass








