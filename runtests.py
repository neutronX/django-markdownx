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
    'TEMPLATE_DIRS': (
        os.path.join(os.path.abspath(os.path.dirname(__file__)), 'markdownx/tests/templates'),
    ),
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
