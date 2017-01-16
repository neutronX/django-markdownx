# Python internal library.
from os import path, SEEK_END
from uuid import uuid4
from collections import namedtuple

# Django library.
from django import forms
from django.utils.six import BytesIO
from django.core.files.storage import default_storage
from django.utils.translation import ugettext_lazy as _
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.template.defaultfilters import filesizeformat

# Internal.
from .utils import scale_and_crop
from .settings import (
    MARKDOWNX_IMAGE_MAX_SIZE,
    MARKDOWNX_MEDIA_PATH,
    MARKDOWNX_UPLOAD_CONTENT_TYPES,
    MARKDOWNX_UPLOAD_MAX_SIZE,
)


class ImageForm(forms.Form):
    image = forms.FileField()

    # Separately defined as it needs to be processed a text file rather than image.
    _SVG_TYPE = 'image/svg+xml'

    _error_templates = {
        # No file is available to upload.
        'not_uploaded':
            forms.ValidationError(_('No files have been uploaded.')),

        # The file is of a format not defined in "settings.py"
        # or if default, in "markdownx/settings.py".
        'unsupported_format':
            forms.ValidationError(_('File type is not supported.')),

        # The file is larger in size that the maximum allow in "settings.py" (or the default).
        'invalid_size':
            lambda current: forms.ValidationError(
                _('Please keep file size under {max}. Current file size {current}').format(
                    max=filesizeformat(MARKDOWNX_UPLOAD_MAX_SIZE),
                    current=filesizeformat(current)
                )
            )
    }

    def save(self, commit=True):
        """
        Saves the uploaded image in the designated location.

        If image type is not SVG, a byteIO of image content_type is created and
        subsequently save; otherwise, the SVG is saved in its existing `charset`
        as an `image/svg+xml`.

        The dimension of image files (excluding SVG) are set using `PIL`.

        :param commit: If `True`, the file is saved to the disk; otherwise, it is held in the memory.
        :type commit: bool
        :return: An instance of saved image if `commit is True`, else `namedtuple(path, image)`.
        :rtype: bool, namedtuple
        """
        image = self.files.get('image')
        content_type = image.content_type
        file_name = image.name
        image_extension = content_type.split('/')[-1].upper()
        image_size = getattr(image, '_size')

        if content_type.lower() != self._SVG_TYPE:
            # Processing the raster graphic image:
            image = self._process_raster(image, image_extension)
            image_size = image.tell()

        # Processed file (or the actual file in the case of SVG) is now
        # saved in the memory as a Django object.
        uploaded_image = InMemoryUploadedFile(
            file=image,
            field_name=None,
            name=file_name,
            content_type=content_type,
            size=image_size,
            charset=None
        )

        return self._save(uploaded_image, file_name, commit)

    def _save(self, image, file_name, commit):
        """
        Final saving process, called internally after the image had processed.
        """
        # Defining a universally unique name for the file
        # to be saved on the disk.
        unique_file_name = self.get_unique_file_name(file_name)
        full_path = path.join(MARKDOWNX_MEDIA_PATH, unique_file_name)

        if commit:
            default_storage.save(full_path, image)
            return default_storage.url(full_path)

        # If `commit is False`, return the path and in-memory image.
        image_data = namedtuple('image_data', ['path', 'image'])
        return image_data(path=full_path, image=image)

    @staticmethod
    def _process_raster(image, extension):
        """
        Processing of raster graphic image.
        """
        # File needs to be uploaded and saved temporarily in
        # the memory for additional processing using PIL.
        thumb_io = BytesIO()
        preped_image = scale_and_crop(image, **MARKDOWNX_IMAGE_MAX_SIZE)
        preped_image.save(thumb_io, extension)
        thumb_io.seek(0, SEEK_END)
        return thumb_io

    @staticmethod
    def get_unique_file_name(file_name):
        """
        Generates a universally unique ID using Python `UUID` and attaches the extension of file name to it.

        :param file_name: Name of the uploaded file, including the extension.
        :type file_name: str
        :return: Universally unique ID, ending with the extension extracted from `file_name`.
        :rtype: str
        """
        file_name = "{unique_name}.{extension}".format(
            unique_name=uuid4(),
            extension=path.splitext(file_name)[1][1:]  # [1] is the extension, [1:] discards the dot.
        )
        return file_name

    def clean(self):
        """
        Checks the upload against allowed extensions and maximum size.

        :return: Upload
        """
        upload = self.cleaned_data.get('image')

        # -----------------------------------------------
        # See comments in `self._error_templates` for
        # additional information on each error.
        # -----------------------------------------------
        if not upload:
            raise self._error_templates['not_uploaded']

        content_type = upload.content_type
        file_size = getattr(upload, '_size')

        if content_type not in MARKDOWNX_UPLOAD_CONTENT_TYPES:
            raise self._error_templates['unsupported_format']
        elif file_size > MARKDOWNX_UPLOAD_MAX_SIZE:
            raise self._error_templates['invalid_size'](file_size)

        return upload
