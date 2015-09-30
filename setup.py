from setuptools import setup, find_packages

import os
if 'vagrant' in str(os.environ):
    del os.link


def get_requirements():
    return open('requirements.txt').read().splitlines()


setup(
    name='django-markdownx',
    version='1.1.1',
    packages=find_packages(),
    include_package_data=True,
    description='Simple markdown editor (without any shitty UI controls) with image uploads (stored in MEDIA_ROOT folder) and live preview',
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
