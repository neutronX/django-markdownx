from django.http import HttpResponse
from django.http import JsonResponse
from django.utils.module_loading import import_string
from django.views.generic.edit import BaseFormView
from django.views.generic.edit import View

from .forms import ImageForm
from .settings import (
    MARKDOWNX_MARKDOWNIFY_FUNCTION,
    MARKDOWNX_MARKDOWNIFY_WITH_REQUEST
)


class MarkdownifyView(View):
    """
    Conversion of Markdown to HTML.
    """

    markdownify = staticmethod(import_string(MARKDOWNX_MARKDOWNIFY_FUNCTION))

    def post(self, request, *args, **kwargs):
        """
        Handling of the conversion from Markdown to HTML using the conversion
        function in settings under ``MARKDOWNX_MARKDOWNIFY_FUNCTION``.

        :param request: HTTP request.
        :param args: Default Django POST arguments.
        :param kwargs: Default Django POST keyword arguments.
        :return: HTTP response
        :rtype: django.http.HttpResponse
        """
        if MARKDOWNX_MARKDOWNIFY_WITH_REQUEST:
            param = request
        else:
            param = request.POST['content']
        return HttpResponse(self.markdownify(param))


class ImageUploadView(BaseFormView):
    """
    Handling requests for uploading images.
    """

    # template_name = "dummy.html"
    form_class = ImageForm
    success_url = '/'

    def form_invalid(self, form):
        """
        Handling of invalid form events.

        :param form: Django form instance.
        :type form: django.forms.Form
        :return: JSON response with the HTTP-400 error message for AJAX requests
                 and the default response for HTTP requests.
        :rtype: django.http.JsonResponse, django.http.HttpResponse
        """
        if self.request.headers.get('x-requested-with') == 'XMLHttpRequest':
            return JsonResponse(form.errors, status=400)

        response = super(ImageUploadView, self).form_invalid(form)
        return response

    def form_valid(self, form):
        """
        If the form is valid, the contents are saved.

        If the **POST** request is AJAX (image uploads), a JSON response will be
        produced containing the Markdown encoded image insertion tag with the URL
        using which the uploaded image may be accessed.

        JSON response would be as follows:

        .. code-block:: bash

            { image_code: "![](/media/image_directory/123-4e6-ga3.png)" }

        :param form: Django form instance.
        :type form: django.forms.Form
        :return: JSON encoded Markdown tag for AJAX requests, and an appropriate
                 response for HTTP requests.
        :rtype: django.http.JsonResponse, django.http.HttpResponse
        """
        response = super(ImageUploadView, self).form_valid(form)

        if self.request.headers.get('x-requested-with') == 'XMLHttpRequest':
            image_path = form.save(commit=True)
            image_code = '![]({})'.format(image_path)
            return JsonResponse({'image_code': image_code})

        return response
