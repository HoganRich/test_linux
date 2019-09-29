from django.http import HttpResponse
from public_api import api as public_api
import json


def get_city_list(request):
    return HttpResponse(public_api.get_city_list(), content_type="application/json")


def search_city(request):
    return HttpResponse(public_api.search_city(request), content_type="application/json")


def get_city(request):
    return HttpResponse(public_api.get_city(request))
