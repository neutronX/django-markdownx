Contributions
=============

We welcome and encourage contributions of all nature; from pointing out an error or a potential problem, to
translations, to feature requests, and pull requests.

We have a implemented a fully comprehensive developers' environment that comes with many functionalities, including its
own Vagrant_ and Docker_ containers.


.. attention::
    Developers' environment is only compatible with Python 3. There are no plans to support Python 2 and we intend to
    cease our support for Python 2 in the next major release.

To set up the developers' environment, start off by cloning our source code from GitHub_, like so:

.. code-block:: bash

    git clone https://github.com/neutronX/django-markdownx.git

One that's done, change to the cloned directory and run:

.. code-block:: python

    python3 dev.py -h

to see the options available.

Quick Reference
---------------

And here is what you will see:

+-------------------------+----------------------------------------------------------+
| Argument                | Description                                              |
+=========================+==========================================================+
| ``-h``, ``--help``      | show the help message and exit.                          |
+-------------------------+----------------------------------------------------------+
| ``-v``, ``--vagrant``   | Install Vagrant development environment (requires        |
|                         | Vagrant).                                                |
+-------------------------+----------------------------------------------------------+
| ``-d``, ``--docker``    | Install Docker development environment (requires         |
|                         | Docker).                                                 |
+-------------------------+----------------------------------------------------------+
| ``-c``, ``--clean``     | Clean up the development files (only the ones that have  |
|                         | been automatically created).                             |
+-------------------------+----------------------------------------------------------+
| ``-run-vagrant``        | Run vagrant development environment (runs ``--vagrant``  |
|                         | if the files don't already exist). Vagrant must be       |
|                         | installed on your machine.                               |
+-------------------------+----------------------------------------------------------+
| ``-run-docker``         | Run docker development environment (runs ``--docker`` if |
|                         | the files don't already exist). Docker must already be   |
|                         | installed on your machine, and Docker Daemon must be up  |
|                         | and running.                                             |
+-------------------------+----------------------------------------------------------+
| ``-no-container``       | Create development files without a container-based       |
|                         | development environment (creates "manage.py" and         |
|                         | "runtests.py").                                          |
+-------------------------+----------------------------------------------------------+
| ``--with-docs``         | Install documentation development environment.           |
+-------------------------+----------------------------------------------------------+
| ``--with-npm-settings`` | Install npm installation environment, including          |
|                         | ``package.json`` for front-end                           |
|                         | (TypeScript) development (requires ``node.js`` and       |
|                         | ``npm``).                                                |
+-------------------------+----------------------------------------------------------+

- ``--with-docs`` and ``--with-npm-settings`` are optional and need to be accompanied by one of the required arguments.
- To save the changes made within the developers' environment, use ``-c`` or ``--clean``; and you will be asked if you
would like to override the existing settings. **Do not commit your changes before doing this**.

Example
-------

This will install the following files:

- manage.py
- runtests.py
- Makefile
- create_docs.py

It will also install the requirements for compiling the documentations. You do not need to create the documentations
locally if you do not intend to change them. Although you are welcome to do so, for minor changes, it is probably
easier to report an issue on GitHub as compiling the documentations can be somewhat tricky.

.. code-block:: bash

    python3 dev.py -no-container --with-docs

Once you are done, run:

.. code-block:: bash

    python3 dev.py -c

will clean the installed files. If any of them have been altered, you will be asked for additional instructions as to
whether to save the changes or discard them and hold onto the default.

.. _Vagrant: https://www.vagrantup.com
.. _Docker: https://www.docker.com
.. _GitHub: https://github.com/neutronX/django-markdownx