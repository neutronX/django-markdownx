# Python internal library.
from os import path, SEEK_END, SEEK_SET
from uuid import uuid4
from collections import namedtuple

# Django library.
from django import forms
from django.utils.six import BytesIO
from django.core.files.storage import default_storage
from django.core.files.uploadedfile import InMemoryUploadedFile

# Internal.
from .utils import scale_and_crop, xml_has_javascript
from .exceptions import MarkdownxImageUploadError

from .settings import (
    MARKDOWNX_IMAGE_MAX_SIZE,
    MARKDOWNX_MEDIA_PATH,
    MARKDOWNX_UPLOAD_CONTENT_TYPES,
    MARKDOWNX_UPLOAD_MAX_SIZE,
    MARKDOWNX_SVG_JAVASCRIPT_PROTECTION
)


class ImageForm(forms.Form):
    """
    Used for the handling of images uploaded using the editor through :guilabel:`AJAX`.
    """

    image = forms.FileField()

    # Separately defined as it needs to be
    # processed a text file rather than image.
    _SVG_TYPE = 'image/svg+xml'

    def save(self, commit=True):
        """
        Saves the uploaded image in the designated location.

        If image type is not SVG, a byteIO of image content_type is created and
        subsequently save; otherwise, the SVG is saved in its existing ``charset``
        as an ``image/svg+xml``.

        *Note*: The dimension of image files (excluding SVG) are set using ``PIL``.

        :param commit: If ``True``, the file is saved to the disk;
                       otherwise, it is held in the memory.
        :type commit: bool
        :return: An instance of saved image if ``commit is True``,
                 else ``namedtuple(path, image)``.
        :rtype: bool, namedtuple
        """
        image = self.files.get('image')
        content_type = image.content_type
        file_name = image.name
        image_extension = content_type.split('/')[-1].upper()
        image_size = image.size

        if content_type.lower() != self._SVG_TYPE:
            # Processing the raster graphic image.
            # Note that vector graphics in SVG format
            # do not require additional processing and
            # may be stored as uploaded.
            image = self._process_raster(image, image_extension)
            image_size = image.tell()
            image.seek(0, SEEK_SET)

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

        if (content_type.lower() == self._SVG_TYPE
                and MARKDOWNX_SVG_JAVASCRIPT_PROTECTION
                and xml_has_javascript(uploaded_image.read())):

            raise MarkdownxImageUploadError(
                'Failed security monitoring: SVG file contains JavaScript.'
            )

        return self._save(uploaded_image, file_name, commit)

    def _save(self, image, file_name, commit):
        """
        Final saving process, called internally after processing tasks are complete.

        :param image: Prepared image
        :type image: django.core.files.uploadedfile.InMemoryUploadedFile
        :param file_name: Name of the file using which the image is to be saved.
        :type file_name: str
        :param commit: If ``True``, the image is saved onto the disk.
        :type commit: bool
        :return: URL of the uploaded image ``commit=True``, otherwise a namedtuple 
                 of ``(path, image)`` where ``path`` is the absolute path generated 
                 for saving the file, and ``image`` is the prepared image.
        :rtype: str, namedtuple
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
        Processing of raster graphic image using Python Imaging Library (PIL).

        This is where raster graphics are processed to the specifications
        as defined in ``settings.py``.

        *Note*: The file needs to be uploaded and saved temporarily in the
        memory to enable processing tasks using Python Imaging Library (PIL)
        to take place and subsequently retained until written onto the disk.

        :param image: Non-SVG image as processed by Django.
        :type image: django.forms.BaseForm.file
        :param extension: Image extension (e.g.: png, jpg, gif)
        :type extension: str
        :return: The image object ready to be written into a file.
        :rtype: BytesIO
        """
        thumb_io = BytesIO()
        preped_image = scale_and_crop(image, **MARKDOWNX_IMAGE_MAX_SIZE)
        preped_image.save(thumb_io, extension)
        thumb_io.seek(0, SEEK_END)
        return thumb_io

    @staticmethod
    def get_unique_file_name(file_name):
        """
        Generates a universally unique ID using Python ``UUID`` and attaches the 
        extension of file name to it.

        :param file_name: Name of the uploaded file, including the extension.
        :type file_name: str
        :return: Universally unique ID, ending with the extension extracted 
                 from ``file_name``.
        :rtype: str
        """
        extension = 1
        extension_dot_index = 1

        file_name = "{unique_name}.{extension}".format(
            unique_name=uuid4(),
            extension=path.splitext(file_name)[extension][extension_dot_index:]
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
            raise MarkdownxImageUploadError.not_uploaded()

        content_type = upload.content_type
        file_size = upload.size

        if content_type not in MARKDOWNX_UPLOAD_CONTENT_TYPES:

            raise MarkdownxImageUploadError.unsupported_format()

        elif file_size > MARKDOWNX_UPLOAD_MAX_SIZE:

            raise MarkdownxImageUploadError.invalid_size(
                current=file_size,
                expected=MARKDOWNX_UPLOAD_MAX_SIZE
            )

        return upload
