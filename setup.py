"""
Installation
============
Using PIP
---------
Django MarkdownX may be installed directly using Python Package Index (PyPi):

.. code-block:: bash

    python3 -m pip install django-markdownx


From the source
---------------
Should you wish to download and install it using the source code, you can do as follows:

Note
    Make sure you have activated your virtual environment if you're using one.

We start off by downloading the source code from GitHub and navigate to the downloaded directory:

.. code-block:: bash

     git clone https://github.com/adi-/django-markdownx.git
     cd django-markdownx/


Install the package. You can replace ``python3`` with ``python`` or any of |Supported_versions_of_Python| if
you have multiple versions installed on your machine:

.. code-block:: bash

   python3 setup.py install


.. |Supported_versions_of_Python| image:: https://img.shields.io/pypi/pyversions/django-markdownx.svg

"""

from setuptools import setup, find_packages
from os import environ, link
from os.path import join, dirname
from re import compile as re_compile


if 'vagrant' in str(environ):
    del link


def get_meta():
    values = {
        'author',
        'author_email',
        'description',
        'credits',
        'copyright',
        'license',
        'maintainer',
        'version'
    }

    # Constructing the parsing pattern for metadata:
    template = str.join('|', values)
    pattern = re_compile(
        r"^_{{2}}"
        r"(?P<name>({}))"
        r"_{{2}}.+[\'\"]"
        r"(?P<value>(.+))"
        r"[\'\"][.\n]?$".format(template)
    )

    meta = dict()

    # Parsing metadata from `./markdownx/__init__.py`:
    path = join(dirname(__file__), 'markdownx', '__init__.py')
    with open(path, 'r') as data:
        for line in data:
            if not line.startswith('__'):
                continue
            found = pattern.search(line)
            if found is not None:
                meta[found.group('name')] = found.group('value')

    return meta


def get_requirements():
    with open('requirements.txt') as requirements:
        req = requirements.read().splitlines()
    return req


metadata = get_meta()


setup(
    name='django-markdownx',
    version=metadata.get('version'),
    packages=find_packages(),
    author=metadata.get('author'),
    author_email=metadata.get('author_email'),
    maintainer=metadata.get('maintainer'),
    include_package_data=True,
    description=metadata.get('description'),
    long_description=metadata.get('doc'),
    url='https://github.com/neutronX/django-markdownx',
    license=metadata.get('license'),
    classifiers=[
        'Development Status :: 5 - Production/Stable',
        'Environment :: Web Environment',
        'Environment :: Plugins',
        'Framework :: Django',
        'Framework :: Django :: 1.8',
        'Framework :: Django :: 1.9',
        'Framework :: Django :: 1.10',
        'Framework :: Django :: 1.11',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: BSD License',
        'Operating System :: OS Independent',
        'Programming Language :: JavaScript',
        'Programming Language :: Python',
        'Programming Language :: Python :: 2.7',
        'Programming Language :: Python :: 3.4',
        'Programming Language :: Python :: 3.5',
        'Programming Language :: Python :: 3.6',
        'Programming Language :: JavaScript',
        'Topic :: Software Development :: Libraries :: Python Modules',
        'Topic :: Multimedia :: Graphics',
        'Topic :: Text Processing :: Markup',
        'Topic :: Text Editors :: Text Processing',
        'Topic :: Text Editors :: Word Processors',
        'Topic :: Text Processing :: Markup :: HTML',
        'Topic :: Multimedia :: Graphics :: Presentation',
        'Topic :: Internet :: WWW/HTTP',
        'Topic :: Internet :: WWW/HTTP :: Site Management'
    ],
    keywords='django markdown markdownx django-markdownx editor image upload drag&drop ajax',
    tests_require=get_requirements(),
    test_suite='runtests',
    install_requires=get_requirements(),

)
