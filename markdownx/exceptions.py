from django.utils.translation import ugettext_lazy as _
from django.forms import ValidationError


class MarkdownxImageUploadError(ValidationError):
    """
    Custom **MarkdownX** exceptions. 
    """

    @classmethod
    def not_uploaded(cls):
        """
        No file is available to upload.

        :return: Locale compatible version of the error with the following message:
        
                 - No files have been uploaded.
        
        :rtype: MarkdownxImageUploadError
        """
        return cls(_('No files have been uploaded.'))

    @classmethod
    def unsupported_format(cls):
        """
        
        The file is of a format not defined in :guilabel:`settings.py`
        or if default, in :guilabel:`markdownx/settings.py`.

        :return: Locale compatible version of the error with the following message:
                 
                 - File type is not supported. 
                 
        :rtype: MarkdownxImageUploadError
        """
        return cls(_('File type is not supported.'))

    @classmethod
    def invalid_size(cls, current, expected):
        """
        The file is larger in size that the maximum allow in :guilabel:`settings.py` (or the default).

        :param current: Current size of the file.
        :type current: float, int
        :param expected: Expected (maximum permitted) size of the file.
        :type expected: float, int
        :return: Locale compatible version of the error with the following message:
        
                 - Please keep file size under %(max)s. Current file size: %(current)s.'
                 
        :rtype: MarkdownxImageUploadError
        """
        from django.template.defaultfilters import filesizeformat

        return cls(
            _('Please keep file size under %(max)s. Current file size: %(current)s.') % {
                'max': filesizeformat(expected),
                'current': filesizeformat(current)
            }
        )
