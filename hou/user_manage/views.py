from django.http import HttpResponse
from user_manage import api as user_manage


def sign_up(request):
    return HttpResponse(user_manage.sign_up(request), content_type="application/json")


def get_info(request):
    return HttpResponse(user_manage.get_info(request), content_type="application/json")


def save_resume_info(request):
    return HttpResponse(user_manage.save_resume_info(request), content_type="application/json")


def get_resume_info(request):
    return HttpResponse(user_manage.get_resume_info(request), content_type="application/json")


def get_my_collection(request):
    return HttpResponse(user_manage.get_my_collection(request), content_type="application/json")


def delete_my_collection(request):
    return HttpResponse(user_manage.delete_my_collection(request), content_type="application/json")


def get_message(request):
    return HttpResponse(user_manage.get_message(request), content_type="application/json")


def check_message(request):
    return HttpResponse(user_manage.check_message(request), content_type="application/json")


def delete_message(request):
    return HttpResponse(user_manage.delete_message(request), content_type="application/json")


def get_balance_rec(request):
    return HttpResponse(user_manage.get_balance_rec(request), content_type="application/json")
