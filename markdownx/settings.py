# Django library.
from django.conf import settings
from django.utils.translation import ugettext_lazy as _
from django.core.exceptions import ImproperlyConfigured


# Constants
# ------------------------------------------------------------------

FIFTY_MEGABYTES = 50 * 1024 * 1024
VALID_CONTENT_TYPES = 'image/jpeg', 'image/png', 'image/svg+xml'
NINETY_DPI = 90
IM_WIDTH = 500
IM_HEIGHT = 500
LATENCY = 500

# ------------------------------------------------------------------


def _mdx(var, default):
    """
    Adds "MARXDOWX_" to the requested variable and retrieves its value
    from settings or returns the default.

    :param var: Variable to be retrieved.
    :type var: str
    :param default: Default value if the variable is not defined.
    :return: Value corresponding to 'var'.
    """
    try:
        return getattr(settings, 'MARKDOWNX_' + var, default)
    except ImproperlyConfigured:
        # To handle the auto-generation of documentations.
        return default


# Markdownify
# --------------------
MARKDOWNX_MARKDOWNIFY_FUNCTION = _mdx('MARKDOWNIFY_FUNCTION', 'markdownx.utils.markdownify')

MARKDOWNX_SERVER_CALL_LATENCY = _mdx('SERVER_CALL_LATENCY', LATENCY)


# Markdown extensions
# --------------------
MARKDOWNX_MARKDOWN_EXTENSIONS = _mdx('MARKDOWN_EXTENSIONS', list())

MARKDOWNX_MARKDOWN_EXTENSION_CONFIGS = _mdx('MARKDOWN_EXTENSION_CONFIGS', dict())


# Markdown urls
# --------------------
MARKDOWNX_URLS_PATH = _mdx('URLS_PATH', '/markdownx/markdownify/')

MARKDOWNX_UPLOAD_URLS_PATH = _mdx('UPLOAD_URLS_PATH', '/markdownx/upload/')


# Media path
#  --------------------
MARKDOWNX_MEDIA_PATH = _mdx('MEDIA_PATH', 'markdownx/')


# Image
# --------------------
MARKDOWNX_UPLOAD_MAX_SIZE = _mdx('UPLOAD_MAX_SIZE', FIFTY_MEGABYTES)

MARKDOWNX_UPLOAD_CONTENT_TYPES = _mdx('UPLOAD_CONTENT_TYPES', VALID_CONTENT_TYPES)

MARKDOWNX_IMAGE_MAX_SIZE = _mdx('IMAGE_MAX_SIZE', dict(size=(IM_WIDTH, IM_HEIGHT), quality=NINETY_DPI))

MARKDOWNX_SVG_JAVASCRIPT_PROTECTION = True


# Editor
# --------------------
MARKDOWNX_EDITOR_RESIZABLE = _mdx('EDITOR_RESIZABLE', True)


# ------------------------------------------------
# Translations
# ------------------------------------------------
# This is not called using `_from_settings` as
# it does not need "_MARKDOWNX" prefix.
try:
    LANGUAGES = getattr(
        settings,
        'LANGUAGES',
        (
            ('en', _('English')),
            ('pl', _('Polish')),
            ('de', _('German')),
            ('fr', _('French')),
            ('fa', _('Persian')),
            ('du', _('Dutch'))
        )
    )
except ImproperlyConfigured:
    # To handle the auto-generation of documentations.
    pass
