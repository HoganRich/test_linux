# !/usr/bin/env python3
# -*- coding: utf-8 -*-
from django.http import HttpResponse
from task_manage import api as task_manage


def add_task(request):
    return HttpResponse(task_manage.add_task(request), content_type="application/json")


def get_recommend_task(request):
    return HttpResponse(task_manage.get_recommend_task(request), content_type="application/json")


def get_task_list(request):
    return HttpResponse(task_manage.get_task_list(request), content_type="application/json")


def get_task_detail(request):
    return HttpResponse(task_manage.get_task_detail(request), content_type="application/json")


def get_skill_list(request):
    return HttpResponse(task_manage.get_skill_list(request), content_type="application/json")


def get_language_list(request):
    return HttpResponse(task_manage.get_language_list(request), content_type="application/json")


def collect_task(request):
    return HttpResponse(task_manage.collect_task(request), content_type="application/json")


def deliver_task(request):
    return HttpResponse(task_manage.deliver_task(request), content_type="application/json")


def get_resume_list(request):
    return HttpResponse(task_manage.get_resume_list(request), content_type="application/json")


def hire(request):
    return HttpResponse(task_manage.hire(request), content_type="application/json")


def get_my_task(request):
    return HttpResponse(task_manage.get_my_task(request), content_type="application/json")


def delete_my_task(request):
    return HttpResponse(task_manage.delete_my_task(request), content_type="application/json")


def get_deliver_task(request):
    return HttpResponse(task_manage.get_deliver_task(request), content_type="application/json")


def delete_deliver_task(request):
    return HttpResponse(task_manage.delete_deliver_task(request), content_type="application/json")


def get_recommend_list(request):
    return HttpResponse(task_manage.get_recommend_list(request), content_type="application/json")
