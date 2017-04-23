from markdown import markdown

from PIL import Image

from .settings import MARKDOWNX_MARKDOWN_EXTENSIONS, MARKDOWNX_MARKDOWN_EXTENSION_CONFIGS


def markdownify(content):
    """

    :param content:
    :type content:
    :return:
    :rtype:
    """
    md = markdown(
        text=content,
        extensions=MARKDOWNX_MARKDOWN_EXTENSIONS,
        extension_configs=MARKDOWNX_MARKDOWN_EXTENSION_CONFIGS
    )
    return md


def scale_and_crop(image, size, crop=False, upscale=False, quality=None):
    """

    :param image:
    :type image:
    :param size:
    :type size:
    :param crop:
    :type crop:
    :param upscale:
    :type upscale:
    :param quality:
    :type quality:
    :return:
    :rtype:
    """
    # ToDo: Possible IO/Runtime exceptions need to handled, and `finally` the file needs to be closed.

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
        im = im.resize(
            (int(source_x * scale), int(source_y * scale)),
            resample=Image.ANTIALIAS
        )

    if crop:
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

    # Close image and replace format/metadata, as PIL blows this away.
    im.format, im.info = im_format, im_info
    image.close()
    return im


def has_javascript(data):
    """

    :param data: Contents to be monitored for JavaScript injection.
    :type data: str
    :return: ``True`` if **data** contains JavaScript tag(s), otherwise ``False``.
    :rtype: bool
    """
    from re import search, IGNORECASE, MULTILINE

    # ------------------------------------------------
    # Handles JavaScript nodes and stringified nodes.
    # ------------------------------------------------
    pattern = (
        r'(<\s*\bscript\b.*>.*)|'
        r'(.*\bif\b\s*\(.?={2,3}.*\))|'
        r'(.*\bfor\b\s*\(.*\))'
    )

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
