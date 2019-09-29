from django.http import HttpResponse
from wx_api import api as wx_api


def get_openid(request):
    return HttpResponse(wx_api.get_openid(request))
