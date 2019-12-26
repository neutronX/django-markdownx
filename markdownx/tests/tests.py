import os
import re
from django.test import TestCase
try:
    from django.urls import reverse
except ImportError:  # Djanago < 2.0
    from django.core.urlresolvers import reverse


class SimpleTest(TestCase):

    def test_me(self):
        response = self.client.get('/testview/')
        self.assertEqual(response.status_code, 200)

    def test_upload(self):
        url = reverse('markdownx_upload')
        with open('markdownx/tests/static/django-markdownx-preview.png', 'rb') as fp:
            response = self.client.post(url, {'image': fp}, HTTP_X_REQUESTED_WITH='XMLHttpRequest')

        try:
            json = response.json()
        except AttributeError:  # Django < 1.9
            import json
            json = json.loads(response.content.decode('utf-8'))

        self.assertEqual(response.status_code, 200)
        self.assertIn('image_code', json)

        match = re.findall(r'(markdownx/[\w\-]+\.png)', json['image_code'])
        try:
            if match:
                os.remove(match[0])
        except OSError:
            pass
