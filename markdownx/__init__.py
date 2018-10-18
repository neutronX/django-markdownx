"""
Django MarkdownX
================

|PyPi_Status| |Build_Status| |Format| |Supported_versions_of_Python| |Supported_versions_of_Django| |License|

.. raw:: html

   <iframe src="https://ghbtns.com/github-btn.html?user=neutronX&repo=django-markdownx&type=star&count=true"
   frameborder="0" scrolling="0" width="120px" height="20px"></iframe>
   <iframe src="https://ghbtns.com/github-btn.html?user=neutronX&repo=django-markdownx&type=watch&count=true&v=2"
   frameborder="0" scrolling="0" width="120px" height="20px"></iframe>

------------

Documentations
--------------

Django MarkdownX is a comprehensive Markdown_ plugin built for Django_, the renowned high-level
Python web framework, with flexibility, extensibility, and ease-of-use at its core.


Key features
````````````

* Raw editing.
* Live preview.
* Drag & drop image uploads (automatically stored in the designated location in the *Media* directory).
* Customizable image insertion tag.
* Definition of maximum size for an image.
* Definition of acceptable image formats (PNG, JPEG, SVG).
* Image manipulations (compression, size reduction, cropping, upscaling).
* Pre- and post- text modification.
* Easy template customization, layout modification, and personalization.
* Multiple editors per page.
* Django Admin support.

.. image:: https://github.com/neutronX/django-markdownx/raw/master/django-markdownx-preview.gif?raw=true
   :target: https://github.com/neutronX/django-markdownx
   :align: center
   :alt: django-markdownx preview

.. _Markdown: https://en.wikipedia.org/wiki/Markdown
.. _Django: https://www.djangoproject.com

.. |PyPi_Status| image:: https://img.shields.io/pypi/status/django-markdownx.svg
.. |Build_Status| image:: https://img.shields.io/travis/neutronX/django-markdownx.svg
.. |Format| image:: https://img.shields.io/pypi/format/django-markdownx.svg
.. |Supported_versions_of_Python| image:: https://img.shields.io/pypi/pyversions/django-markdownx.svg
.. |Supported_versions_of_Django| image:: https://img.shields.io/badge/Django-1.8,%201.9,%201.10,%201.11-green.svg
.. |License| image:: https://img.shields.io/pypi/l/django-markdownx.svg

------------
"""

# ~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=
# Imports
# ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
# None

# ~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=
# Documentations
# ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
__credits__ = 'Adi, Pouria Hadjibagheri'
__copyright__ = 'Copyright 2017'
__license__ = 'BSD'
__maintainer__ = 'Adi, Pouria Hadjibagheri'
__url__ = 'https://github.com/neutronX/django-markdownx'
__version__ = '2.0.25'
__description__ = 'A comprehensive Markdown editor built for Django.'
# ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-


if __name__ == '__main__':
    raise RuntimeError(
        'MarkdownX is a Django plugin. It is not meant to be run as an stand-alone module.'
    )
