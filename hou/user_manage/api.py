from public_api import models
from decimal import Decimal
from public_api import api as public_api
from public_api import user_collection_view
from public_api import user_resume_view
import json
import datetime
import os


def sign_up(request):
    try:
        user_id = json.loads(bytes.decode(request.body)).get('user_id')
        user_info = json.loads(bytes.decode(request.body)).get('user_info')
        if not models.TUser.objects.filter(open_id=user_id).values():
            models.TUser.objects.create(open_id=user_id, user_avatar=user_info[
                'avatarUrl'], user_nickname=user_info['nickName']).save()
        return json.dumps({
            'code': 0,
            'data': '注册成功'})
    except Exception as e:
        print(e)
        return json.dumps({
            'code': 1,
            'msg': '连接服务器失败'
        })


def get_info(request):
    try:
        user_id = json.loads(bytes.decode(request.body)).get('user_id')
        res = public_api.jsonParse(
            models.TUser.objects.filter(open_id=user_id).values())
        if res:
            return json.dumps({
                'code': 0,
                'data': res})
        else:
            return json.dumps({
                'code': 0,
                'data': []})
    except Exception as e:
        print(e)
        return json.dumps({
            'code': 1,
            'msg': '连接服务器失败'
        })


def save_resume_info(request):
    try:
        user_resume_info = json.loads(bytes.decode(
            request.body)).get('user_resume_info')
        print(user_resume_info)
        # 如果已存在
        is_exist = models.TUserResume.objects.filter(
            user=models.TUser.objects.get(open_id=user_resume_info['user_id'])).count()
        if is_exist == 1:
            resume_info = models.TUserResume.objects.get(
                user=models.TUser.objects.get(open_id=user_resume_info['user_id']))
            resume_info.company = user_resume_info['company']
            resume_info.occupation = user_resume_info['occupation']
            resume_info.city_id = user_resume_info['city']['city_id']
            resume_info.expect_salary = user_resume_info['expect_salary']
            resume_info.work_years = user_resume_info['work_years']
            resume_info.skill_lables = ','.join(
                list(map(lambda x: str(x), user_resume_info['skill_lables'])))
            resume_info.experience_des = user_resume_info['experience_des']
            resume_info.skill_des = user_resume_info['skill_des']
            resume_info.experience_url = user_resume_info['experience_url']
            resume_info.save()
        else:
            models.TUserResume.objects.create(user=models.TUser.objects.get(open_id=user_resume_info['user_id']),
                                              company=user_resume_info['company'], occupation=user_resume_info['occupation'],
                                              city_id=user_resume_info['city']['city_id'], expect_salary=user_resume_info[
                                                  'expect_salary'], work_years=user_resume_info['work_years'],
                                              experience_des=user_resume_info['experience_des'], skill_des=user_resume_info[
                                                  'skill_des'], skill_lables=','.join(list(map(lambda x: str(x), user_resume_info['skill_lables']))),
                                              experience_url=user_resume_info['experience_url'])
        return json.dumps({
            'code': 0,
            'data': '保存成功'})
    except Exception as e:
        print(e)
        return json.dumps({
            'code': 1,
            'msg': '连接服务器失败'
        })


def get_resume_info(request):
    try:
        user_id = json.loads(bytes.decode(
            request.body)).get('user_id')
        flag = json.loads(bytes.decode(
            request.body)).get('flag')
        print(user_id, len(user_id) != 36)
        if len(user_id) != 28:
            user_resume_info = public_api.jsonParse(user_resume_view.UserResumeView.objects.filter(
                user_id=user_id).values())
        else:
            user_resume_info = public_api.jsonParse(user_resume_view.UserResumeView.objects.filter(
                user_id=models.TUser.objects.filter(open_id=user_id).values('user_id')[0]['user_id']).values())
        data = list(map(format_resume_info, user_resume_info, [flag]))
        print(data)
        return json.dumps({
            'code': 0,
            'data': data})
    except Exception as e:
        print(e)
        return json.dumps({
            'code': 1,
            'msg': '连接服务器失败'
        })


def format_resume_info(item, flag):
    item['city'] = {
        'city_id': item['city_id'],
        'city_name': item['city_name']
    }
    item['expect_salary'] = item['expect_salary'].to_eng_string().split('.')[0]
    skill_lables = []
    if item['skill_lables']:
        for lable in item['skill_lables'].split(','):
            skill_lables.append(int(lable))
    item['skill_lables'] = skill_lables
    del item['city_id']
    del item['city_name']
    return item


def get_my_collection(request):
    try:
        user_id = models.TUser.objects.filter(open_id=json.loads(bytes.decode(
            request.body)).get('user_id')).values('user_id')[0]['user_id']
        print(user_id)
        collect_info = public_api.jsonParse(user_collection_view.UserCollectionView.objects.filter(
            user_id=user_id).values())
        print(collect_info)
        return json.dumps({
            'code': 0,
            'data': list(map(format_collection_info, collect_info))})
    except Exception as e:
        print(e)
        return json.dumps({
            'code': 1,
            'msg': '连接服务器失败'
        })


def format_collection_info(item):
    now = datetime.datetime.today()
    item['task_price'] = item['task_price'].to_eng_string()

    del item['collect_time']
    del item['end_time']
    # del item['is_deliver']
    del item['user_id']
    return item


def delete_my_collection(request):
    try:
        user_id = json.loads(bytes.decode(request.body)).get('user_id')
        task_id = json.loads(bytes.decode(request.body)).get('task_id')
        models.TCollection.objects.filter(user=models.TUser.objects.get(
            open_id=user_id), task=models.TTask.objects.get(task_id=task_id)).delete()
        return json.dumps({
            'code': 0,
            'data': '删除成功'})
    except Exception as e:
        print(e)
        return json.dumps({
            'code': 1,
            'msg': '连接服务器失败'
        })


def get_message(request):
    try:
        user_id = json.loads(bytes.decode(request.body)).get('user_id')
        print(user_id)
        data = models.TMessage.objects.filter(user=models.TUser.objects.get(
            open_id=user_id)).values()
        return json.dumps({
            'code': 0,
            'data': list(map(format_message, data))})
    except Exception as e:
        print(e)
        return json.dumps({
            'code': 1,
            'msg': '连接服务器失败'
        })


def format_message(item):
    item['notifytime'] = item['notifytime'].strftime("%Y-%m-%d %H:%M:%S")
    return item


def check_message(request):
    try:
        user_id = json.loads(bytes.decode(request.body)).get('user_id')
        id = json.loads(bytes.decode(request.body)).get('message_id')
        message = models.TMessage.objects.get(
            id=id, user_id=models.TUser.objects.get(open_id=user_id))
        if message.task_id:
            task = models.TDeliverRec.objects.get(task=message.task_id)
            task.status = 1
            task.save()
        message.ischeck = 1
        message.save()
        return json.dumps({
            'code': 0,
            'data': []})
    except Exception as e:
        print(e)
        return json.dumps({
            'code': 1,
            'msg': '连接服务器失败'
        })


def delete_message(request):
    try:
        user_id = json.loads(bytes.decode(request.body)).get('user_id')
        message_id = json.loads(bytes.decode(request.body)).get('message_id')
        print(user_id, message_id)
        models.TMessage.objects.get(user=models.TUser.objects.get(
            open_id=user_id), id=message_id).delete()
        return json.dumps({
            'code': 0,
            'data': []})
    except Exception as e:
        print(e)
        return json.dumps({
            'code': 1,
            'msg': '连接服务器失败'
        })
