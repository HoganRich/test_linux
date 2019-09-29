from django.http import HttpResponse
from clerk_manage import api as clerk_manage


def get_clerk_list(request):
    return HttpResponse(clerk_manage.get_clerk_list(request), content_type="application/json")


def get_clerk_detail(request):
    return HttpResponse(clerk_manage.get_clerk_detail(request), content_type="application/json")
