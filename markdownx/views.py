from django.views.generic.edit import View, FormView
from django.http import HttpResponse, JsonResponse

from .forms import ImageForm
from .utils import markdownify


class MarkdownifyView(View):

    def post(self, request, *args, **kwargs):
        return HttpResponse(markdownify(request.POST['content']))


class ImageUploadView(FormView):

    template_name = "dummy.html"
    form_class = ImageForm
    success_url = '/'

    def form_invalid(self, form):
        response = super(ImageUploadView, self).form_invalid(form)
        if self.request.is_ajax():
            return JsonResponse(form.errors, status=400)
        else:
            return response

    def form_valid(self, form):
        image_path = form.save()
        response = super(ImageUploadView, self).form_valid(form)

        if self.request.is_ajax():
            image_code = '![]({})'.format(image_path)
            return JsonResponse({'image_code': image_code})
        else:
            return response
