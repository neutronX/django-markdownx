MarkdownX
---------

.. js:data:: GeneralEventHandlers

    :JSON Object: General (document level) event handlers.

    .. js:function:: inhibitDefault(event)

        Routine tasks for event handlers (e.g. default preventions).

        :param Event|KeyboardEvent event: The events to be inhibited.
        :returns: event
        :return type: Event

    .. js:function:: onDragEnter (event)

        Upon enter (when a file, e.g. an image, is dragged into the browser),
        the defualt events are inhibited, and the drop event is set as `copy`.

        :param DragEvent event: Drag event.
        :returns: Inhibited drag event with `copy` added to the drop event.
        :return type: Event


.. js:data:: keyboardEvents

    :JSON Object: Keyboard events and their handlers.

    .. js:attribute:: TAB

        - (*string*) - represents: ``Tab``

    .. js:attribute:: DUPLICATE

        - (*string*) - represents: ``d``

    .. js:attribute:: UNINDENT

        - (*string*) - represents: ``[``

    .. js:attribute:: INDENT

        - (*string*) - represents: ``]``

    .. js:function:: hub(event)

        Mapping of hotkeys from keyboard events to their corresponding functions.

        :param KeyboardEvent event: Keyboard event to be handled.
        :return type: Function | Boolean

    .. js:data:: Handlers

        Handler functions, as mapped by :js:func:`hub`.

        :JSON Object: Hotkey response functions.

        .. note::
            Properties receive a single argument ``properties``, which is an instance of :js:data:`properties`. See the
            ``markdownx`` class for additional details.

        .. js:function:: applyTab(properties)

            Smart application of tab indentations under various conditions.

            :param JSON properties: See object descriptions for details.
            :return type: string

        .. js:function:: removeTab(properties)

            Smart removal of tab indentations.

            :param JSON properties: See object descriptions for details.
            :return type: string

        .. js:function:: _multiLineIndentation(properties)

            **private**

            Handles multi line indentations.

            :param JSON properties: See object descriptions for details.
            :return type: string

        .. js:function:: applyIndentation(properties)

            Smart application of indentation at the beginning of the line.

            :param JSON properties: See object descriptions for details.
            :return type: string

        .. js:function:: removeIndentation(properties)

            Smart removal of indentation from the beginning of the line.

            :param JSON properties: See object descriptions for details.
            :return type: string

        .. js:function:: applyDuplication(properties)

            Duplication of the current or selected lines.

            :param JSON properties: See object descriptions for details.
            :return type: string


.. js:function:: getHeight(element)

    Returns either the height of an element as defined in the ``style`` attribute or CSS or its browser-computed height.

    :param element HTMLElement: The element whose height is to be determined.
    :returns: Height of the element.
    :return type: number


.. js:function:: updateHeight(element)

    Updates the height of an element based on its scroll height.

    :param HTMLTextAreaElement editor: Editor element whose height is to be updated.
    :return type: HTMLTextAreaElement


.. js:class:: MarkdownX(editor, preview)

    MarkdownX initializer.

    :example:
        .. code-block:: javascript

            >>> let parent  = document.getElementsByClassName('markdownx'),
            ...     editor  = parent.querySelector('.MyMarkdownEditor'),
            ...     preview = parent.querySelector('.MyMarkdownPreview');

            >>> let mdx = new MarkdownX(parent, editor, preview)

    :param HTMLElement parent: Markdown editor element.
    :param HTMLTextAreaElement editor: Markdown editor element.
    :param HTMLElement preview: Markdown preview element.

    .. js:data:: properties

        :JSON Object: Class variables.

        .. js:attribute:: editor

            - (*HTMLTextAreaElement*) - Instance editor.

        .. js:attribute:: preview

            - (*HMTLElement*) - Instance preview.

        .. js:attribute:: parent

            - (*HMTLElement*) - Instance parent.

        .. js:attribute:: _latency

            **private**

            - (*number* | *null*) - Private property; timeout settings.

        .. js:attribute:: _editorIsResizable

            **private**

            - (*Boolean*) - Private property; ``true`` if instance editor is resizable, otherwise ``false``.

    .. js:function:: _markdownify()

        **private**

        Settings for ``timeout``.

    .. js:function:: _routineEventResponse(event)

        **private**

        Routine tasks for event handlers (e.g. default preventions).

        :param Event event: Event to be handled.

    .. js:function:: getEditorHeight(editor)

        :param HTMLTextAreaElement editor: Markdown editor element.
        :returns: The editor's height in pixels; e.g. ``"150px"``.
        :return type: string

    .. js:function:: inputChanged()

        Event handlers in response to alterations in the instance editor.

        :param Event event: Event to be handled.

    .. js:function:: onDragEnter(event)

        Event handler for :guilabel:`dragEnter` events.

        :param Event event: Event to be handled.

    .. js:function:: onDragLeave(event)

        Event handler for :guilabel:`dragLeave` events.

        :param Event event: Event to be handled.

    .. js:function:: onDrop(event)

        Event handler for :guilabel:`drop` events (in drag and drops).

        :param Event event: Event to be handled.

    .. js:function:: onKeyDown(event)

        Event handler for :guilabel:`keyDown` events as registered in the instance editor.

        :param Event event: Event to be handled.
        :returns: ``null`` if the key pressed is *Tab* (ASCII #9) else ``false``.
        :return type: boolean | null

    .. js:function:: sendFile(file)

        Uploading the ``file`` onto the server through an AJAX request.

        :param File file: File to be uploaded.

    .. js:function:: getMarkdown()

        Uploading the markdown text from :attr:`properties.editor` onto the server through an AJAX request, and upon
        receiving the HTML encoded text in response, the response will be displayed in :attr:`properties.preview`.

    .. js:function:: insertImage(textToInsert)

        Inserts markdown encoded image URL into :attr:`properties.editor` where the cursor is located.

        :param string textToInsert: Markdown text (with path to the image) to be inserted into the editor.
