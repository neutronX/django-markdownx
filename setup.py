from setuptools import setup, find_packages

import os
if 'vagrant' in str(os.environ):
    del os.link

setup(
    name='django-markdownx',
    version='0.4.2',
    packages=find_packages(),
    include_package_data=True,
    description='Simple markdown editor (with live preview and images uploads) built for Django',
    url='https://github.com/adi-/django-markdownx',
    author='adi-',
    author_email='adrian@enove.pl',
    license='BSD',
    classifiers=[
        'Development Status :: 4 - Beta',
        'Environment :: Web Environment',
        'Framework :: Django',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: BSD License',
        'Topic :: Software Development',
        'Topic :: Software Development :: User Interfaces',
        'Operating System :: OS Independent',
        'Programming Language :: Python :: 2.7',
        'Programming Language :: JavaScript',
    ],
    keywords='django markdown live preview images upload',
    install_requires=['Pillow', 'Markdown'],
)
