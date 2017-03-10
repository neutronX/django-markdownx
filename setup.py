from setuptools import setup, find_packages

import os
if 'vagrant' in str(os.environ):
    del os.link

def get_requirements():
    return open('requirements.txt').read().splitlines()


setup(
    name='django-markdownx',
    version='1.8.1',
    packages=find_packages(),
    include_package_data=True,
    description='django-markdownx is a Markdown editor built for Django.',
    long_description='''https://github.com/adi-/django-markdownx/

Key features
------------

* raw editing
* live preview
* drag&drop image uploads (stored locally in `MEDIA` folder)
* customizable image insertion tag
* image filtering using content types and max file size
* image manipulations (compression, size, cropping, upscaling)
* pre-&post- text altering
* easy template customization for layout purposes
* multiple editors on one page
* Django Admin support

Preview
-------

.. image:: https://github.com/adi-/django-markdownx/raw/master/django-markdownx-preview.gif?raw=true
   :target: https://github.com/adi-/django-markdownx
   :alt: django-markdownx preview

*(using Bootstrap for layout and styling)*
''',
    url='https://github.com/adi-/django-markdownx',
    license='BSD',
    classifiers=[
        'Development Status :: 5 - Production/Stable',
        'Environment :: Web Environment',
        'Framework :: Django',
        'Framework :: Django :: 1.8',
        'Framework :: Django :: 1.9',
        'Framework :: Django :: 1.10',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: BSD License',
        'Operating System :: OS Independent',
        'Programming Language :: JavaScript',
        'Programming Language :: Python',
        'Programming Language :: Python :: 2.7',
        'Programming Language :: Python :: 3.4',
        'Programming Language :: Python :: 3.5',
        'Programming Language :: Python :: 3.6',
        'Topic :: Software Development :: Libraries :: Python Modules',
    ],
    keywords='django markdown markdownx django-markdownx editor image upload drag&drop',
    tests_require=get_requirements(),
    test_suite='runtests',
    install_requires=get_requirements(),

)
