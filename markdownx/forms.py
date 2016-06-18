import os
import uuid

from django import forms
from django.utils.six import BytesIO
from django.core.files.storage import default_storage
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
        thumb_io = BytesIO()
        img.save(thumb_io, self.files['image'].content_type.split('/')[-1].upper())

        file_name = str(self.files['image'])
        thumb_io.seek(0, os.SEEK_END)
        img = InMemoryUploadedFile(thumb_io, None, file_name, self.files['image'].content_type, thumb_io.tell(), None)

        unique_file_name = self.get_unique_file_name(file_name)
        full_path = os.path.join(MARKDOWNX_MEDIA_PATH, unique_file_name)
        default_storage.save(full_path, img)

        return default_storage.url(full_path)

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
