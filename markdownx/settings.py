from django.conf import settings
from django.utils.translation import ugettext_lazy as _

# markdown.markdown kwargs
MARKDOWNX_MARKDOWN_KWARGS = getattr(settings, 'MARKDOWNX_MARKDOWN_KWARGS', dict())

# path
MARKDOWNX_MEDIA_PATH = getattr(settings, 'MARKDOWNX_MEDIA_PATH', 'markdownx/')

# image
MARKDOWNX_MAX_UPLOAD_SIZE = getattr(settings, 'MARKDOWNX_MAX_UPLOAD_SIZE', 52428800) # 50MB
MARKDOWNX_CONTENT_TYPES = getattr(settings, 'MARKDOWNX_CONTENT_TYPES', ['image/jpeg', 'image/png'])
MARKDOWNX_IMAGE_SIZE = getattr(settings, 'MARKDOWNX_IMAGE_SIZE', {'size': (500, 500), 'quality': 90,})

# translations
LANGUAGES = getattr(settings, 'LANGUAGES', (
    ('en', _('English')),
    ('pl', _('Polish')),
)
)
