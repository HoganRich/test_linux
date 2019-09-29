"""crowdsourcing URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from wx_api import views as wx_api
# !/usr/bin/env python3
# -*- coding: utf-8 -*-
from public_api import views as public_api
from task_manage import views as task_manage
from user_manage import views as user_manage
urlpatterns = [
    path('admin/', admin.site.urls),
    path('getOpenId', wx_api.get_openid),
    path('getCityList', public_api.get_city_list),
    path('searchCity', public_api.search_city),
    path('getCity', public_api.get_city),
    path('releaseTask', task_manage.add_task),
    path('getRecommendTask', task_manage.get_recommend_task),
    path('getTaskList', task_manage.get_task_list),
    path('getTaskDetail', task_manage.get_task_detail),
    path('getSkillList', task_manage.get_skill_list),
    path('getLanguageList', task_manage.get_language_list),
    path('collectTask', task_manage.collect_task),
    path('deliverTask', task_manage.deliver_task),
    path('getResumeList', task_manage.get_resume_list),
    path('getUserInfo', user_manage.get_info),
    path('signUp', user_manage.sign_up),
    path('saveResumeInfo', user_manage.save_resume_info),
    path('getResumeInfo', user_manage.get_resume_info),
    path('getMyCollection', user_manage.get_my_collection),
    path('deleteMyCollection', user_manage.delete_my_collection),
    path('getMessage', user_manage.get_message),
    path('checkMessage', user_manage.check_message),
    path('deleteMessage', user_manage.delete_message),
    path('hire', task_manage.hire),
    path('getMyTask', task_manage.get_my_task),
    path('deleteMyTask', task_manage.delete_my_task),
    path('getDeliverTask', task_manage.get_deliver_task),
    path('deleteDeliverTask', task_manage.delete_deliver_task),
    path('getRecommendList', task_manage.get_recommend_list)
]
