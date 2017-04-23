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


.. js:function:: preparePostData(data)

    Creates a new instance of **FormData** to be used in AJAX calls.

    :param Object data: Data to be embedded in the form in **JSON** format, where the *key* is the name/ID of the field
                        whose values are to be altered/created and corresponds to ``dict`` keys in Django
                        ``request.POST``.

    :param Boolean csrf: If ``true``, includes the CSRF token (under the name ``csrfmiddlewaretoken``) in the form.
                         Default is ``true``.

    :returns: A new instance **FormData** that incorporated the data embedded in ``data`` and the CSRF token in enabled.
    :return type: FormData
