MarkdownX
---------


.. js:class:: MarkdownX(editor, preview)

	**Example:**

	.. code-block:: javascript

		let editor  = document.getElementById('MyMarkdownEditor'),
			preview = document.getElementById('MyMarkdownPreview');

		let mdx = new MarkdownX(editor, preview)

	:param HTMLTextAreaElement editor: Markdown editor element.
	:param HTMLElement preview: Markdown preview element.

	.. js:attribute:: editor

		- (*HTMLTextAreaElement*) - Instance editor.

	.. js:attribute:: preview

		- (*HMTLElement*) - Instance preview.

	.. js:attribute:: timeout

		- (*number* | *null*) - Private property; timeout settings.

	.. js:attribute:: _editorIsResizable

		- (*Boolean*) - Private property; ``true`` if instance editor is resizable, otherwise ``false``.

	.. js:function:: _markdownify()

		Private settings for ``timeout``.

	.. js:function:: _routineEventResponse(event)

		Private routine tasks for event handlers (e.g. default preventions).

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

	.. js:function:: sendFile()

		pass

	.. js:function:: getMarkdown()

		pass

	.. js:function:: insertImage()

		pass
