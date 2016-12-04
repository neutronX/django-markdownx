from django.views.generic.base import TemplateView
from django.views.generic.edit import FormView, CreateView

from testapp.models import MyModel
from testapp.forms import MyForm


class IndexTemplateView(TemplateView):
    template_name = 'index.html'

class TestFormView(FormView):
    template_name = "test_form_view.html"
    form_class = MyForm
    success_url = '/'

class TestCreateView(CreateView):
    template_name = "test_create_view.html"
    model = MyModel
    fields = ['markdownx_field1', 'markdownx_field2', 'textfield1', 'textfield2']
    success_url = '/'
