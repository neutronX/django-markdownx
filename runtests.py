from __future__ import absolute_import

import os
import sys

sys.path.append(os.path.join(os.path.dirname(__file__), 'markdownx'))

import django
from django.conf import settings

configure_settings = {
    'DATABASES': {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': ':memory:',
        }
    },
    'INSTALLED_APPS': [
        'django.contrib.auth',
        'django.contrib.contenttypes',
        'django.contrib.sessions',
        'django.contrib.staticfiles',
        'markdownx',
    ],
    'DEBUG': False,
    'STATIC_URL': '/static/',
    'TEMPLATES': [
        {
            'BACKEND': 'django.template.backends.django.DjangoTemplates',
            'DIRS': [
                os.path.join(os.path.abspath(os.path.dirname(__file__)), 'markdownx/tests/templates'),
            ],
            'APP_DIRS': True,
            'OPTIONS': {
                'context_processors': [
                    'django.contrib.auth.context_processors.auth',
                    'django.template.context_processors.debug',
                    'django.template.context_processors.i18n',
                    'django.template.context_processors.media',
                    'django.template.context_processors.static',
                    'django.template.context_processors.tz',
                    'django.contrib.messages.context_processors.messages',
                ],
                'debug': True,
            },
        },
    ],
    'ROOT_URLCONF': 'tests.urls',
}

settings.configure(**configure_settings)
django.setup()

from django.test.utils import get_runner
test_runner = get_runner(settings)
failures = test_runner(
    verbosity=1,
    interactive=False,
    failfast=False).run_tests(['tests'])
sys.exit(failures)
