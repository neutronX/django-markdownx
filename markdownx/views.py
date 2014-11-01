from django.views.generic.edit import FormView
from django.http import JsonResponse

from . import forms


class ImageUploadView(FormView):
    template_name = "dummy.html"
    form_class = forms.ImageForm
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
            data = {}
            data['image_path'] = image_path
            return JsonResponse(data)
        else:
            return response
