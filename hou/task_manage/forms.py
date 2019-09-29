from django.forms import ModelForm
from public_api import models


class TaskForm(ModelForm):

    class Meta:
        model = models.TTask
        fields = '__all__'
