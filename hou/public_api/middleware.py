# !/usr/bin/env python3
# -*- coding: utf-8 -*-
from django.shortcuts import HttpResponse
import json

try:
    from django.utils.deprecation import MiddlewareMixin  # Django 1.10.x
except ImportError:
    MiddlewareMixin = object  # Django 1.4.x - Django 1.9.x


class MethodMiddleware(MiddlewareMixin):

    def process_request(self, request):
        if request.method != 'POST':
            return HttpResponse(json.dumps({'code': 1, 'msg': '请求方式错误'}))
