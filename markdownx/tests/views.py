from django.views.generic.edit import CreateView

from .models import MyModel

class TestView(CreateView):
    template_name = "test_view.html"
    model = MyModel
    fields = ['markdownx_field']
