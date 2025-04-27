import os
import re
from contextlib import contextmanager
from unittest import mock

from django.test import TestCase
from django.urls import reverse


class SimpleTest(TestCase):

    @contextmanager
    def _get_image_fp(self):
        full_path = os.path.join(
            os.path.dirname(__file__),
            'static',
            'django-markdownx-preview.png',
        )
        with open(full_path, 'rb') as fp:
            yield fp

    def test_upload_anonymous_fails(self):
        url = reverse('markdownx_upload')

        # Test that image upload fails for an anonymous user when
        # MARKDOWNX_UPLOAD_ALLOW_ANONYMOUS is the default False.
        with self._get_image_fp() as fp:
            response = self.client.post(url, {'image': fp}, HTTP_X_REQUESTED_WITH='XMLHttpRequest')
        self.assertEqual(response.status_code, 403)

    def test_upload_anonymous_succeeds_with_setting(self):
        """
        Ensures that uploads succeed when MARKDOWNX_UPLOAD_ALLOW_ANONYMOUS
        is True. This implicitly tests the authenticated case as well.
        """
        url = reverse('markdownx_upload')

        # A patch is required here because the view sets the
        # MARKDOWNX_UPLOAD_ALLOW_ANONYMOUS at first import, reading from
        # django.conf.settings once, which means Django's standard
        # override_settings helper does not work. There's probably a case for
        # re-working the app-local settings.
        with mock.patch('markdownx.settings.MARKDOWNX_UPLOAD_ALLOW_ANONYMOUS', True):
            with self._get_image_fp() as fp:
                response = self.client.post(url, {'image': fp}, HTTP_X_REQUESTED_WITH='XMLHttpRequest')

        self.assertEqual(response.status_code, 200)
        json = response.json()
        self.assertIn('image_code', json)

        match = re.findall(r'(markdownx/[\w\-]+\.png)', json['image_code'])
        try:
            if match:
                os.remove(match[0])
        except OSError:
            pass
