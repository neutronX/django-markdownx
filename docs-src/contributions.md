# Contributions

We welcome and encourage contributions of all nature; from pointing out an error or a potential problem, to translations, to feature requests, and pull requests.

We have a implemented a fully comprehensive developers' environment that comes with many functionalities, including its
own [Vagrant](https://www.vagrantup.com) and [Docker](https://www.docker.com) containers.

	
To set up the developers' environment, start off by cloning our source code from [GitHub](https://github.com/neutronX/django-markdownx), like so:

```bash
git clone https://github.com/neutronX/django-markdownx.git
```

One that's done, change to the cloned directory and run:

```python
python3 dev.py -h
```

to see the options available.

## Quick reference

### ``-h``, ``--help``
Show the help message and exit.

### ``-v``, ``--vagrant``
Install Vagrant development environment (requires Vagrant).

### ``-d``, ``--docker``
Install Docker development environment (requires Docker).

### ``-c``, ``--clean``
Clean up the development files (only the ones that have been automatically created).

### ``-run-vagrant``
Run vagrant development environment (runs ``--vagrant`` if the files don't already exist). Vagrant must be installed on your machine.

### ``-run-docker``
Run docker development environment (runs ``--docker`` if the files don't already exist). Docker must already be installed on your machine, and Docker Daemon must be up and running.

### ``-no-container``
Create development files without a container-based development environment (creates `manage.py` and `runtests.py`).

## Optional

### ``--with-docs``
Install documentation development environment.

### ``--with-npm-settings``
Install npm installation environment, including `package.json` for front-end (TypeScript) development (requires ``node.js`` and ``npm``).

!!! note
    - ``--with-docs`` and ``--with-npm-settings`` are optional and need to be accompanied by one of the required arguments.
    - To save the changes made within the developers' environment, use ``-c`` or ``--clean``; and you will be asked if you
    would like to override the existing settings. **Do not commit your changes before doing this**.

## Example

This will install the following files:

- manage.py
- runtests.py
- Makefile
- create_docs.py

It will also install the requirements for compiling the documentations. You do not 
need to create the documentations locally if you do not intend to change them. 
Although you are welcome to do so, for minor changes, it is probably easier to report 
an issue on GitHub as compiling the documentations can be somewhat tricky.

```bash
python3 dev.py -no-container --with-docs
```

However, if you still want to run a preview of the edited documentation, use the 
following command to see the result (it will run documentation preview on port 
`http://localhost:8001`)

```bash
mkdocs serve
```

Once done, please run:

```bash
python3 dev.py -c
```

to clean the installed files. If any of them have been altered, you will be asked for additional instructions as to whether to save the changes or discard them and hold onto the default.

## Tests

Django packages require `manage.py` and more often than not, `settings.py` files to run. This introduces a challenge for testing apps outside of a fully constructed project environment. This is one of the reasons why we introduced the developers' environment, which allows for a fully setup container ([Vagrant](https://www.vagrantup.com) or [Docker](https://www.docker.com)) to create an inclusive virtual server that can be used to run MarkdownX independently.

!!! attention
    You need to have either [Vagrant](https://www.vagrantup.com) or [Docker](https://www.docker.com) along with [Oracle VirtualBox](https://www.virtualbox.org) installed and configured to run either of these.

!!! note
    Vagrant will attempt to download and install Ubuntu Xenial, whilst Docker uses the default operating system if one already exists.

To take advantage of this, you should clone the source code from [GitHub](https://github.com/neutronX/django-markdownx) as explained above, and depending on your container of choice, follow these instructions:

## Vagrant

```bash
python3 dev.py --vagrant
```

Files will be created:

- Vagrantfile
- bootstrap.sh
- runtests.py
- manage.py
- package.json

```bash
python3 dev.py -run-vagrant
```

Connect to server using ```http://localhost:8000/``` or ```http://127.0.0.1:8000/```

## Docker

```bash
python3 dev.py --docker
```

Files will be created:

- Dockerfile
- docker-compose.yml
- entrypoint.sh
- runtests.py
- manage.py
- package.json

```bash
python3 dev.py -run-docker
```

Connect to server using ```http://localhost:8000/``` or ```http://127.0.0.1:8000/```

---

!!! tip
    Any changes made to the code whilst the container is up and running is automatically reflected without the need to restart the container.
    
## Cleanup

Once done, please run:

```bash
python3 dev.py -c
```

to clean the installed files. If any of them have been altered, you will be asked for additional instructions as to whether to save the changes or discard them and hold onto the default.
