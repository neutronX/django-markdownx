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
}

settings.configure(**configure_settings)

from django.test.utils import get_runner
if django.VERSION >= (1, 7):
    django.setup()

test_runner = get_runner(settings)
failures = test_runner(
    verbosity=1,
    interactive=False,
    failfast=False).run_tests()
sys.exit(failures)
