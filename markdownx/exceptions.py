from django.utils.translation import ugettext_lazy as _
from django.forms import ValidationError


class MarkdownxImageUploadError(ValidationError):
    """

    """

    @staticmethod
    def not_uploaded():
        """
        No file is available to upload.

        :return:
        :rtype:
        """
        return MarkdownxImageUploadError(_('No files have been uploaded.'))

    @staticmethod
    def unsupported_format():
        """
        The file is of a format not defined in :guilabel:`settings.py`
        or if default, in :guilabel:`markdownx/settings.py`.

        :return:
        :rtype:
        """
        return MarkdownxImageUploadError(_('File type is not supported.'))

    @staticmethod
    def invalid_size(current, expected):
        """
        The file is larger in size that the maximum allow in :guilabel:`settings.py` (or the default).

        :param current:
        :type current:
        :param expected:
        :type expected:
        :return:
        :rtype:
        """
        from django.template.defaultfilters import filesizeformat

        return MarkdownxImageUploadError(
            _('Please keep file size under %(max)s. Current file size: %(current)s.') % {
                'max': filesizeformat(expected),
                'current': filesizeformat(current)
            }
        )
