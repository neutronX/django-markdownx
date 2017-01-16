# Django library.
from django.conf import settings
from django.utils.translation import ugettext_lazy as _


# Constants
# ------------------------------------------------------------------

__FIFTY_MEGABYTES = 50 * 1024 * 1024
__VALID_CONTENT_TYPES = 'image/jpeg', 'image/png', 'image/svg+xml'

# ------------------------------------------------------------------


def _from_settings(var, default):
    """
    Adds "MARXDOWX_" to the requested variable and retrieves its value
     from settings or returns the default.

    :param var: Variable to be retrieved.
    :type var: str
    :param default: Default value if the variable is not defined.
    :return: Value corresponding to 'var'.
    """
    return getattr(settings, 'MARKDOWNX_' + var, default)


# Markdownify
# ------------
MARKDOWNX_MARKDOWNIFY_FUNCTION = _from_settings('MARKDOWNIFY_FUNCTION', 'markdownx.utils.markdownify')


# Markdown extensions
# --------------------
MARKDOWNX_MARKDOWN_EXTENSIONS = _from_settings('MARKDOWN_EXTENSIONS', list())

MARKDOWNX_MARKDOWN_EXTENSION_CONFIGS = _from_settings('MARKDOWN_EXTENSION_CONFIGS', dict())


# Markdown urls
# --------------
MARKDOWNX_URLS_PATH = _from_settings('URLS_PATH', '/markdownx/markdownify/')

MARKDOWNX_UPLOAD_URLS_PATH = _from_settings('UPLOAD_URLS_PATH', '/markdownx/upload/')


# Media path
# -----------
MARKDOWNX_MEDIA_PATH = _from_settings('MEDIA_PATH', 'markdownx/')


# Image
# ------
MARKDOWNX_UPLOAD_MAX_SIZE = _from_settings('UPLOAD_MAX_SIZE', __FIFTY_MEGABYTES)

MARKDOWNX_UPLOAD_CONTENT_TYPES = _from_settings('UPLOAD_CONTENT_TYPES', __VALID_CONTENT_TYPES)

MARKDOWNX_IMAGE_MAX_SIZE = _from_settings('IMAGE_MAX_SIZE', dict(size=(500, 500), quality=90))


# Editor
# -------
MARKDOWNX_EDITOR_RESIZABLE = _from_settings('EDITOR_RESIZABLE', True)


# ------------------------------------------------
# Translations
# ------------------------------------------------
# This is not called using `_from_settings` as
# it does not need "_MARKDOWNX" prefix.
LANGUAGES = getattr(
    settings,
    'LANGUAGES',
    (
        ('en', _('English')),
        ('pl', _('Polish')),
    )
)
