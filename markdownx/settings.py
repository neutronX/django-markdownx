from django.conf import settings
from django.utils.translation import ugettext_lazy as _


# Markdownify
MARKDOWNX_MARKDOWNIFY_FUNCTION = getattr(settings, 'MARKDOWNX_MARKDOWNIFY_FUNCTION', 'markdownx.utils.markdownify')

# Markdown extensions
MARKDOWNX_MARKDOWN_EXTENSIONS = getattr(settings, 'MARKDOWNX_MARKDOWN_EXTENSIONS', [])
MARKDOWNX_MARKDOWN_EXTENSION_CONFIGS = getattr(settings, 'MARKDOWNX_MARKDOWN_EXTENSION_CONFIGS', {})

# Markdown urls
MARKDOWNX_URLS_PATH = getattr(settings, 'MARKDOWNX_URLS_PATH', '/markdownx/markdownify/')
MARKDOWNX_UPLOAD_URLS_PATH = getattr(settings, 'MARKDOWNX_UPLOAD_URLS_PATH', '/markdownx/upload/')

# Media path
MARKDOWNX_MEDIA_PATH = getattr(settings, 'MARKDOWNX_MEDIA_PATH', 'markdownx/')

# Image
MARKDOWNX_UPLOAD_MAX_SIZE = getattr(settings, 'MARKDOWNX_UPLOAD_MAX_SIZE', 52428800) # 50MB
MARKDOWNX_UPLOAD_CONTENT_TYPES = getattr(settings, 'MARKDOWNX_UPLOAD_CONTENT_TYPES', ['image/jpeg', 'image/png'])
MARKDOWNX_IMAGE_MAX_SIZE = getattr(settings, 'MARKDOWNX_IMAGE_MAX_SIZE', {'size': (500, 500), 'quality': 90,})

# Editor
MARKDOWNX_EDITOR_RESIZABLE = getattr(settings, 'MARKDOWNX_EDITOR_RESIZABLE', True)

# Translations
LANGUAGES = getattr(settings, 'LANGUAGES', (
    ('en', _('English')),
    ('pl', _('Polish')),
)
)
