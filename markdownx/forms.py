from os import path
from os import SEEK_END
from uuid import uuid4

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

# -------------------------------------------------------
# Constants
# -------------------------------------------------------

SVG_TYPE = 'image/svg+xml'
SVG_EXTENSION = 'svg'

# -------------------------------------------------------


class ImageForm(forms.Form):

    image = forms.FileField()

    def save(self, commit=True):
        """
        Saves the uploaded image in the designated location.

        If image type is not SVG, a byteIO of image content_type is created and
        subsequently save; otherwise, the SVG is saved in its existing `charset`
        as an `image/svg+xml`.

        The dimension of image files (excluding SVG) are set using `Pillow`.

        :param commit: If `True`, the file is saved to the disk; otherwise, it is held in the memory.
        :type commit: bool
        :return: An instance of saved image if `commit` is `True`, else `full_path, uploaded_image`.
        """
        image = self.files.get('image')
        content_type = image.content_type
        thumb_io = None
        file_name = image.name

        if image.content_type is SVG_TYPE:
            thumb_io = BytesIO()
            preped_image = scale_and_crop(image, **MARKDOWNX_IMAGE_MAX_SIZE)
            image_extension = image.content_type.split('/')[-1].upper()
            preped_image.save(thumb_io, image_extension)
            file_name = str(image)
            thumb_io.seek(0, SEEK_END)

        uploaded_image = InMemoryUploadedFile(
            file=thumb_io if thumb_io else image,
            field_name=None,
            name=file_name,
            content_type=content_type,
            size=thumb_io.tell() if thumb_io else getattr(image, '_size'),
            charset=None
        )

        unique_file_name = self.get_unique_file_name(file_name)
        full_path = path.join(MARKDOWNX_MEDIA_PATH, unique_file_name)

        if commit:
            default_storage.save(full_path, uploaded_image)
            return default_storage.url(full_path)

        # If `commit=False`, return the path and in-memory image.
        return full_path, uploaded_image

    @staticmethod
    def get_unique_file_name(filename):
        """
        Generates a universally unique ID using Python `UUID` and
        attaches the extension of file name to it.
        :param filename: Name of the uploaded file, including the extension.
        :type filename: str
        :return: Universally unique ID, ending with the extension extracted from `filename`.
        :rtype: str
        """
        ext = filename.split('.')[-1]
        filename = "%s.%s" % (uuid4(), ext)
        return filename

    def clean(self):
        """
        Checks the upload against allowed extensions and maximum size.
        :return: Upload
        """
        upload = self.cleaned_data.get('image')
        if not upload:
            raise forms.ValidationError(_('No files have been uploaded.'))

        content_type = upload.content_type
        file_size = getattr(upload, '_size')

        if content_type not in MARKDOWNX_UPLOAD_CONTENT_TYPES:
            raise forms.ValidationError(_('File type is not supported.'))

        elif file_size > MARKDOWNX_UPLOAD_MAX_SIZE:
            raise forms.ValidationError(
                _('Please keep file size under %(max)s. Current file size %(current)s') %
                {
                    'max': filters.filesizeformat(MARKDOWNX_UPLOAD_MAX_SIZE),
                    'current': filters.filesizeformat(upload._size)
                }
            )

        return upload
