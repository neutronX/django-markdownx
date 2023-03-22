import os
import re
from django.test import TestCase
from django.urls import reverse


class SimpleTest(TestCase):

    def test_upload(self):
        url = reverse('markdownx_upload')
        with open('markdownx/tests/static/django-markdownx-preview.png', 'rb') as fp:
            response = self.client.post(url, {'image': fp}, HTTP_X_REQUESTED_WITH='XMLHttpRequest')
            json = response.json()

        self.assertEqual(response.status_code, 200)
        self.assertIn('image_code', json)

        match = re.findall(r'(markdownx/[\w\-]+\.png)', json['image_code'])
        try:
            if match:
                os.remove(match[0])
        except OSError:
            pass
