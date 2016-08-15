from setuptools import setup, find_packages

import os
if 'vagrant' in str(os.environ):
    del os.link

def get_requirements():
    return open('requirements.txt').read().splitlines()


setup(
    name='django-markdownx',
    version='1.6.1',
    packages=find_packages(),
    include_package_data=True,
    description='Django Markdownx is a Markdown editor built for Django. It enables raw editing, live preview and image uploads (stored in `MEDIA` folder) with drag&drop functionality and auto tag insertion.',
    long_description='See full readme: https://github.com/adi-/django-markdownx',
    url='https://github.com/adi-/django-markdownx',
    download_url='https://github.com/adi-/django-markdownx/archive/master.zip',
    license='BSD',
    classifiers=[
        'Development Status :: 5 - Production/Stable',
        'Environment :: Web Environment',
        'Framework :: Django :: 1.8',
        'Framework :: Django :: 1.9',
        'Framework :: Django :: 1.10',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: BSD License',
        'Operating System :: OS Independent',
        'Programming Language :: JavaScript',
        'Programming Language :: Python :: 2.7',
        'Programming Language :: Python :: 3.3',
        'Programming Language :: Python :: 3.4',
        'Programming Language :: Python :: 3.5',
    ],
    keywords='django markdown markdownx django-markdownx editor image upload drag&drop',
    tests_require=get_requirements(),
    test_suite='runtests',
    install_requires=get_requirements(),

)
