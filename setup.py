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

from setuptools import setup
from os import environ, link
from os.path import join, dirname


if 'vagrant' in str(environ):
    del link


def get_meta():
    from sys import version_info

    keys = {
        '__description__',
        '__credits__',
        '__copyright__',
        '__license__',
        '__maintainer__',
        '__url__',
        '__version__'
    }

    path = join(dirname(__file__), 'markdownx', '__init__.py')

    if version_info.major == 3 and version_info.minor >= 5:
        from importlib.util import spec_from_file_location, module_from_spec
        spec = spec_from_file_location('.', path)
        mod = module_from_spec(spec)
        spec.loader.exec_module(mod)
    elif version_info.major == 3:
        from importlib.machinery import SourceFileLoader
        mod = SourceFileLoader('.', path).load_module()
    else:
        from imp import load_source
        mod = load_source('.', path)

    meta = {key.replace('__', ''): getattr(mod, key) for key in keys}

    return meta


def get_requirements():
    with open('requirements.txt') as requirements:
        req = requirements.read().splitlines()
    return req

def readme():
    with open('README.rst') as f:
        return f.read()


metadata = get_meta()

setup(
    name='django-markdownx',
    version=metadata.get('version'),
    packages=['markdownx', 'markdownx.tests'],
    maintainer=metadata.get('maintainer'),
    include_package_data=True,
    description=metadata.get('description'),
    long_description=readme(),
    url=metadata.get('url'),
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
        'Framework :: Django :: 2.0',
        'Framework :: Django :: 2.1',
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
