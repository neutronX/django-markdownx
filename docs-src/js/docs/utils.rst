Utilities
---------


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
    :return type: string | null


.. js:function:: zip(...rows)

    JavaScript implementation of Python's ``zip`` function.

    :param rows: Array or arrays to zipped together.
    :returns: Array of zipped items.
    :return type: Array[]

    :example:
        .. code-block:: javascript

            >>> let zipped = zip([1, 'H'], [5, 'i']);

            >>> zipped.map(row => row.reduce((m, n) => m + n))
            // [6, "Hi"]


.. js:function:: mountEvents (...collections)

    Mounts a set of events defined in an object onto the document.

    :param collections: Must be JSON object and follow the structure outlined in the example.
    :returns: Listeners
    :return type: Event

    :example:
        .. code-block:: javascript

             >>> let editorListeners = {
             ...         object: document.getElementById('my-editor'),
             ...         listeners: [
             ...             { type: "input",            capture: true , listener: inputChanged },
             ...             { type: "compositionstart", capture: true , listener: onKeyDown    }
             ...         ]
             ... };


.. js:function:: triggerEvent(element, type)

    Triggers an existing HTML event manually.

    :param Element element: Element whose event is to be created and triggered.
    :param string type: Type of the event to be triggered.


.. js:function:: triggerCustomEvent(type, element, args)

    Triggers an already defined custom event manually.

    :param Element|Document element: Element whose event is to be triggered.
    :param string type: Type of the event to be triggered.
    :param args: Values to be passed as custom argument to ``event.details``. (Default = ``null``)


.. js:function:: preparePostData(data)

    Creates a new instance of **FormData** to be used in AJAX calls.

    :param Object data: Data to be embedded in the form in **JSON** format, where the *key* is the name/ID of the field
                        whose values are to be altered/created and corresponds to ``dict`` keys in Django
                        ``request.POST``.

    :param Boolean csrf: If ``true``, includes the CSRF token (under the name ``csrfmiddlewaretoken``) in the form.
                         Default is ``true``.

    :returns: A new instance **FormData** that incorporated the data embedded in ``data`` and the CSRF token if enabled.
    :return type: FormData


.. js:function:: AJAXRequest()

    Determines the supported AJAX requests API in IE6+ browsers.

    :return type: XMLHttpRequest
    :throws TypeError: AJAX request is not supported.


.. js:class:: Request(url, data)

    An XMLHttpRequest wrapper object to initialize AJAX POST requests.

    :example:
        .. code-block:: javascript

            >>> let value   = "This is a test value",
                    postUrl = "https://example.com/";

            >>> const xhr = new utils.Request(
            ...         postUrl,                           // URL
            ...         preparePostData({content: value})  // Data
            ...     );

            >>> xhr.success  = response => console.log(response);

            >>> xhr.error    = response => console.error(response);

            >>> xhr.progress = event    => {
            ...
            ...     if (event.lengthComputable)
            ...         console.info(`${(event.loaded / event.total) * 100}% uploaded.`)
            ...
            ... };

            >>> xhr.send();

    .. js:attribute:: url

        - (*string*) - URL to which the data is to be posted.

    .. js:attribute:: data

        - (*FormData*) - Data, as an instance of `FromData`, to be posted.

    .. js:attribute:: xhr

        **private**

        - (*any*) - Value obtained automatically by calling :js:func:`AjaxRequest`.

    .. js:function:: constructor(url, data)

        :param string url: URL to which the data is to be posted.
        :param FormData data: Data, as an instance of `FromData`, to be posted.

    .. js:function:: progress(event)

        Progress callback.

        :param Event event: The entire event (see the example for additional information on usage).

    .. js:function:: success(response)

        Success callback.

        :param any response: Success values; first available one of ``responseText``, ``responseXML``, or ``response``.

    .. js:function:: error(response)

        Error callback.

        :param any response: Error value: ``responseText``.

    .. js:function:: send()

        Starts the transfer.


.. js:function:: addClass(element, ...classNames)

    Given an instance of an element, adds classes to it.

    :param Element element: Instance of an element.
    :param string[] classNames: Can be a single string, or multiple strings.

    :example:
        .. code-block:: javascript

            >>> addClass(document.getElementById('my-element'), 'className');

            // or

            >>> addClass(document.getElementById('my-element'), 'classA', 'classB', 'classC');


.. js:function:: hasClass(element, className)

    Given an instance of an element, confirms whether or not the element has the class.

    :param Element element: Instance of an element.
    :param string[] className: Can be a single string, or multiple strings.
    :returns: ``true`` if the element has the class, otherwise ``false``.
    :return type: boolean
    :example:
        .. code-block:: javascript

            >>> hasClass(document.getElementById('my-element'), 'className')
            // returns True if the element with id "my-element" has the class "className", otherwise False.


.. js:function:: removeClass(element, ...classNames)

    Given an instance of an element, removes classes to it.

    :param Element element: Instance of an element.
    :param string[] classNames: Can be a single string, or multiple strings.
    :example:
        .. code-block:: javascript

            >>> removeClass(document.getElementById('my-element'), 'className');

            // or

            >>> removeClass(document.getElementById('my-element'), 'classA', 'classB', 'classC');
