from django.conf import settings
from django.utils.translation import ugettext_lazy as _

# Markdown extensions
MARKDOWNX_MARKDOWN_EXTENSIONS = getattr(settings, 'MARKDOWNX_MARKDOWN_EXTENSIONS', [])

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
