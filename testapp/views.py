from django.views.generic.base import TemplateView
from django.views.generic.edit import FormView, CreateView

from testapp.forms import MyForm


class TestFormView(FormView):
    template_name = "index.html"
    form_class = MyForm
