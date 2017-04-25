from django.db import models

from .fields import MarkdownxFormField


class MarkdownxField(models.TextField):
    """
    Custom Django field for Markdown text.
    
    Parameters are identical to those of the ordinary Django **TextField** parameters for the model
    fields. For consistency therefore, the descriptions have been borrowed from Django's official
    documentations (with minor modifications).
    
    :param verbose_name: A human-readable name for the field. If the verbose name isn't given,
                         Django will automatically create it using the field's attribute name,
                         converting underscores to spaces.
    :type verbose_name: str
    :param blank: If ``True``, the field is allowed to be blank. Default is ``False``.
    :type blank: bool
    :param null: If ``True``, Django will store empty values as **NULL** in the database.
                 Default is ``False``.
    :type null: bool
    :param editable: If ``False``, the field will not be displayed in the admin or any other
                     ModelForm. They are also skipped during model validation. Default is ``True``.
    :type editable: bool
    :param help_text: Extra "help" text to be displayed with the form widget. It's useful for
                      documentation even if your field isn't used on a form. Note that this value
                      is not HTML-escaped in automatically-generated forms. This lets you include
                      HTML in ``help_text`` if you so desire.
    :type help_text: str
    :param validators: A list of validators to run for this field. See the validators_ documentations
                       for additional information.
    :type validators: list, tuple
    :param error_messages: The error_messages argument lets you override the default messages that the field
                           will raise. Pass in a dictionary with keys matching the error messages you want
                           to override. Relevant error message keys include ``null``, ``blank``,
                           and ``invalid``.
    :type error_messages: dict
    :param kwargs: Other ``django.db.models.field`` parameters. See Django documentations_ for additional
                   information.
    
    .. _documentations: https://docs.djangoproject.com/en/1.10/ref/models/fields/#error-messages
    .. _validators: https://docs.djangoproject.com/en/DEV_CONTENTS_XML/ref/validators/
    """

    def formfield(self, **kwargs):
        """
        Customising the ``form_class``.

        :return: TextField with a custom ``form_class``.
        :rtype: django.db.models.TextField
        """
        defaults = {'form_class': MarkdownxFormField}
        defaults.update(kwargs)
        return super(MarkdownxField, self).formfield(**defaults)
