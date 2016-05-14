from setuptools import setup, find_packages

import os
if 'vagrant' in str(os.environ):
    del os.link

def get_requirements():
    return open('requirements.txt').read().splitlines()


setup(
    name='django-markdownx',
    version='1.5',
    packages=find_packages(),
    include_package_data=True,
    description='Django Markdownx is a Markdown editor built for Django. It enables raw editing, live preview and image uploads (stored in `MEDIA` folder) with drag&drop functionality and auto tag insertion. Also, django-markdownx supports multiple editors on one page.',
    long_description='See full readme: https://github.com/adi-/django-markdownx',
    url='https://github.com/adi-/django-markdownx',
    author='adi-',
    author_email='aaadeji@gmail.com',
    license='BSD',
    classifiers=[
        'Development Status :: 5 - Production/Stable',
        'Environment :: Web Environment',
        'Framework :: Django',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: BSD License',
        'Topic :: Software Development',
        'Topic :: Software Development :: User Interfaces',
        'Operating System :: OS Independent',
        'Programming Language :: Python :: 2.7',
        'Programming Language :: Python :: 3.3',
        'Programming Language :: Python :: 3.4',
        'Programming Language :: Python :: 3.5',
        'Programming Language :: JavaScript',
    ],
    keywords='django markdown live preview images upload',
    tests_require=get_requirements(),
    test_suite='runtests',
    install_requires=get_requirements(),
)
