import os
import re
from datetime import datetime
from unittest.mock import patch

from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase

from markdownx.forms import ImageForm

try:
    from django.urls import reverse
except ImportError:  # Django < 2.0
    from django.core.urlresolvers import reverse


def _callable_media_path():
    return datetime.now().strftime("%Y/%d/%m/")


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

    @patch("markdownx.forms.MARKDOWNX_MEDIA_PATH", _callable_media_path)
    def test_callable_media_path(self):
        test_file_path = "markdownx/tests/static/django-markdownx-preview.png"

        with open(test_file_path, "rb") as fp:
            form = ImageForm(
                files={
                    "image": SimpleUploadedFile(
                        fp.name, fp.read(), content_type="image/png"
                    )
                }
            )

            self.assertTrue(form.is_valid())
            image_data = form.save(commit=False)

            self.assertTrue(_callable_media_path() in image_data.path)
