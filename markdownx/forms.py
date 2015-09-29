import os
import uuid


from django import forms
from django.conf import settings
from django.utils.six import StringIO
from django.utils.translation import ugettext_lazy as _
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.template import defaultfilters as filters

from .utils import scale_and_crop
from .settings import (
    MARKDOWNX_IMAGE_MAX_SIZE,
    MARKDOWNX_MEDIA_PATH,
    MARKDOWNX_UPLOAD_CONTENT_TYPES,
    MARKDOWNX_UPLOAD_MAX_SIZE,
)


class ImageForm(forms.Form):

    image = forms.ImageField()

    def save(self, commit=True):
        img = scale_and_crop(self.files['image'], **MARKDOWNX_IMAGE_MAX_SIZE)
        thumb_io = StringIO.StringIO()
        img.save(thumb_io,  self.files['image'].content_type.split('/')[-1].upper())

        file_name = str(self.files['image'])
        img = InMemoryUploadedFile(thumb_io, "image", file_name, self.files['image'].content_type, thumb_io.len, None)

        unique_file_name = self.get_unique_file_name(file_name)
        full_path = os.path.join(settings.MEDIA_ROOT, MARKDOWNX_MEDIA_PATH, unique_file_name)
        if not os.path.exists(os.path.dirname(full_path)):
            os.makedirs(os.path.dirname(full_path))

        destination = open(full_path, 'wb+')
        for chunk in img.chunks():
            destination.write(chunk)
        destination.close()

        return os.path.join(settings.MEDIA_URL, MARKDOWNX_MEDIA_PATH, unique_file_name)

    def get_unique_file_name(instance, filename):
        ext = filename.split('.')[-1]
        filename = "%s.%s" % (uuid.uuid4(), ext)
        return filename

    def clean(self):
        upload = self.cleaned_data['image']
        content_type = upload.content_type
        if content_type in MARKDOWNX_UPLOAD_CONTENT_TYPES:
            if upload._size > MARKDOWNX_UPLOAD_MAX_SIZE:
                raise forms.ValidationError(_('Please keep filesize under %(max)s. Current filesize %(current)s') % {'max':filters.filesizeformat(MARKDOWNX_UPLOAD_MAX_SIZE), 'current':filters.filesizeformat(upload._size)})
        else:
            raise forms.ValidationError(_('File type is not supported'))

        return upload
