from PIL import Image
from markdown import markdown

from .settings import MARKDOWNX_MARKDOWN_EXTENSIONS
from .settings import MARKDOWNX_MARKDOWN_EXTENSION_CONFIGS


# TODO: try catch for file.open when image is corrupted


def markdownify(content):
    """
    Trans-compiles Markdown text to HTML.

    :param content: Markdown text.
    :type content: str
    :return: HTML encoded text.
    :rtype: str
    """
    md = markdown(
        text=content,
        extensions=MARKDOWNX_MARKDOWN_EXTENSIONS,
        extension_configs=MARKDOWNX_MARKDOWN_EXTENSION_CONFIGS
    )
    return md


def _crop(im, target_x, target_y):
    """
    Crops the image to the given specifications.

    :param im: Instance of the image.
    :type im: PIL Image
    :param target_x: New x-axis.
    :type target_x: int
    :param target_y: New y-axis
    :type target_y: int
    :return: Cropped image.
    :rtype: PIL.Image
    """
    # Use integer values now.
    source_x, source_y = im.size
    # Difference between new image size and requested size.
    diff_x = int(source_x - min(source_x, target_x))
    diff_y = int(source_y - min(source_y, target_y))

    if diff_x or diff_y:
        # Center cropping (default).
        halfdiff_x, halfdiff_y = diff_x // 2, diff_y // 2
        box = [
            halfdiff_x,
            halfdiff_y,
            min(source_x, int(target_x) + halfdiff_x),
            min(source_y, int(target_y) + halfdiff_y)
        ]

        # Finally, crop the image!
        im = im.crop(box)
    return im


def _scale(im, x, y):
    """
    Scales the image to the given specifications.

    :param im: Instance of the image.
    :type im: PIL Image
    :param x: x-axis size.
    :type x: int
    :param y: y-axis size.
    :type y: int
    :return: Scaled image, re-sampled with anti-aliasing filter.
    :rtype: Image
    """
    im = im.resize(
        (int(x), int(y)),
        resample=Image.Resampling.LANCZOS
    )
    return im


def scale_and_crop(image, size, crop=False, upscale=False, quality=None):
    """
    Modifies raster graphic images to the specifications.

    :param image: Raster graphic image.
    :type image: BytesIO
    :param size: New size.
    :type size: int
    :param crop: Perform cropping or not.
    :type crop: bool
    :param upscale: Whether or not to upscale the image.
    :type upscale: bool
    :param quality: Quality of the new image in DPI.
    :type quality: int
    :return: Raster graphic image modified to the given specifications.
    :rtype: BytesIO
    """
    # Open image and store format/metadata.
    image.open()
    im = Image.open(image)
    im_format, im_info = im.format, im.info
    if quality:
        im_info['quality'] = quality

    # Force PIL to load image data.
    im.load()

    source_x, source_y = map(float, im.size)
    target_x, target_y = map(float, size)

    if crop or not target_x or not target_y:
        scale = max(target_x / source_x, target_y / source_y)
    else:
        scale = min(target_x / source_x, target_y / source_y)

    # Handle one-dimensional targets.
    if not target_x:
        target_x = source_x * scale
    elif not target_y:
        target_y = source_y * scale

    if scale < 1.0 or (scale > 1.0 and upscale):
        im = _scale(im=im, x=source_x * scale, y=source_y * scale)

    if crop:
        im = _crop(im=im, target_x=target_x, target_y=target_y)

    # Close image and replace format/metadata, as PIL blows this away.
    im.format, im.info = im_format, im_info

    image.close()

    return im


def xml_has_javascript(data):
    """
    Checks XML for JavaScript. See "security" in :doc:`customization <../../customization>` for
    additional information.

    :param data: Contents to be monitored for JavaScript injection.
    :type data: str, bytes
    :return: ``True`` if **data** contains JavaScript tag(s), otherwise ``False``.
    :rtype: bool
    """
    from re import search, IGNORECASE, MULTILINE

    data = str(data, encoding='UTF-8')
    # ------------------------------------------------
    # Handles JavaScript nodes and stringified nodes.
    # ------------------------------------------------
    # Filters against "script" / "if" / "for" within node attributes.
    pattern = r'(<\s*\bscript\b.*>.*)|(.*\bif\b\s*\(.?={2,3}.*\))|(.*\bfor\b\s*\(.*\))'

    found = search(
        pattern=pattern,
        string=data,
        flags=IGNORECASE | MULTILINE
    )

    if found is not None:
        return True

    # ------------------------------------------------
    # Handles JavaScript injection into attributes
    # for element creation.
    # ------------------------------------------------
    from xml.etree.ElementTree import fromstring

    parsed_xml = (
        (attribute, value)
        for elm in fromstring(data).iter()
        for attribute, value in elm.attrib.items()
    )

    for key, val in parsed_xml:
        if '"' in val or "'" in val:
            return True

    # It is (hopefully) safe.
    return False
