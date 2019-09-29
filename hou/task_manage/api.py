from task_manage import forms
from public_api import models
from django.db.models import Q
from public_api import api as public_api
from public_api import task_user_view
from public_api import user_resume_view
import json
import jieba
import jieba.analyse
import random
import uuid
import datetime
from uuid import uuid4
from decimal import Decimal


def add_task(request):
    try:
        task_info = json.loads(bytes.decode(request.body)).get('task_info')
        print(task_info)
        models.TTask.objects.create(user=models.TUser.objects.get(open_id=task_info['user_id']),
                                    city=models.TCity.objects.get(city_id=task_info['city_id']), end_time=task_info['end_time'],
                                    task_title=task_info['task_title'], task_description=task_info[
                                        'task_description'],
                                    task_price=task_info['task_price'], language=models.TLanguage.objects.get(
                                        id=task_info['language_id']),
                                    skill=models.TSkill.objects.get(id=task_info['skill_id']))
        return json.dumps({
            'code': 0,
            'data': '发布成功'})
    except Exception as e:
        print(e)
        return json.dumps({
            'code': 1,
            'msg': '连接服务器失败'
        })


def get_recommend_task(request):
    try:
        now = datetime.datetime.now()
        page = json.loads(bytes.decode(request.body)).get('page')
        city_id = json.loads(bytes.decode(request.body)).get('city_id')
        print(page)
        if city_id == 0:
            res = task_user_view.TaskUserView.objects.filter(
                end_time__gte=now)[page * 10:(page + 1) * 10]
        else:
            res = task_user_view.TaskUserView.objects.filter(
                city_id=city_id, end_time__gte=now)[page * 10:(page + 1) * 10]
        return json.dumps({
            'code': 0,
            'data': list(map(format_task_list, public_api.jsonParse(res.values())))
        })
    except Exception as e:
        print(e)
        return json.dumps({
            'code': 1,
            'msg': '连接服务器失败'
        })


def get_skill_list(request):
    try:
        res = public_api.jsonParse(models.TSkill.objects.filter().values())
        return json.dumps({
            'code': 0,
            'data': res})
    except:
        return json.dumps({
            'code': 1,
            'msg': '连接服务器失败'
        })


def get_language_list(request):
    try:
        res = public_api.jsonParse(models.TLanguage.objects.filter().values())
        return json.dumps({
            'code': 0,
            'data': res})
    except:
        return json.dumps({
            'code': 1,
            'msg': '连接服务器失败'
        })


def search_task(request):
    try:
        sort = json.loads(bytes.decode(request.body)).get('sort')
        res = public_api.jsonParse(
            models.TTask.objects.filter().values())
        return json.dumps({
            'code': 0,
            'data': res})
    except Exception as e:
        print(e)
        return json.dumps({
            'code': 1,
            'msg': '连接服务器失败'
        })


def record_browse(data):
    res = public_api.jsonParse(models.objects.TBrowseRec.filter(
        user=public_api.jsonParse(models.TUser.objects.filter(open_id=data['user_id']).values())[0]['user_id'], task=data['task_id']).values('count'))
    if res:
        models.objects.TBrowseRec.create(
            browse_id=str(uuid4(), user=data['user_id'], task=data['task_id'], count=res[0]['count'] + 1))
    else:
        models.objects.TBrowseRec.create(
            browse_id=str(uuid4(), user=data['user_id'], task=data['task_id'], count=1))


def record_search(data):
    models.objects.TSearchRec.create(
        search_id=str(uuid4(), user=data['user_id'], keyword=data['keyword']))


def get_task_detail(request):
    try:
        task_id = json.loads(bytes.decode(request.body)).get('task_id')
        user_id = json.loads(bytes.decode(request.body)).get('user_id')
        if user_id != '':
            user_id = models.TUser.objects.get(open_id=user_id)
            models.TBrowseRec.objects.create(
                user=user_id, task=models.TTask.objects.get(task_id=task_id))
        res = public_api.jsonParse(
            task_user_view.TaskUserView.objects.filter(task_id=task_id).values())
        return json.dumps({
            'code': 0,
            'data': list(map(format_task_detail, res, [user_id]))[0]})
    except Exception as e:
        print(e)
        return json.dumps({
            'code': 1,
            'msg': '连接服务器失败'
        })


def format_task_detail(item, browse_user_id):
    item['is_collected'] = []
    print(browse_user_id)
    if browse_user_id:
        item['is_collected'] = public_api.jsonParse(models.TCollection.objects.filter(
            user=browse_user_id, task_id=item['task_id']).values('user_id'))
    item['deliver_info'] = public_api.jsonParse(
        models.TDeliverRec.objects.filter(user=browse_user_id, task=item['task_id']).values())
    item['deliver_info'] = list(map(format_deliver_info, item['deliver_info']))
    item['task_price'] = item['task_price'].to_eng_string()
    item['release_time'] = item['release_time'].strftime("%Y-%m-%d")
    item['end_time'] = item['end_time'].strftime("%Y-%m-%d")
    print(item)
    return item


def get_task_list(request):
    try:
        now = datetime.datetime.now()
        user_id = models.TUser.objects.get(open_id=json.loads(
            bytes.decode(request.body)).get('user_id'))
        city_id = json.loads(bytes.decode(request.body)).get('city_id')
        sort = json.loads(bytes.decode(request.body)).get('sort')
        print(sort, user_id)
        if sort['keyword']:
            models.TSearchRec.objects.create(
                user=user_id, keyword=sort['keyword'])
        obj = task_user_view.TaskUserView.objects
        # 最新发布
        if sort['sort_id'] == 1:
            obj = obj.order_by(
                "-release_time")
        elif sort['sort_id'] == 2:
            obj = obj.order_by(
                "-task_price")
        elif sort['sort_id'] == 3:
            obj = obj.order_by("task_price")
        elif sort['sort_id'] == 4:
            obj = obj.order_by("-post_num")
        if sort['skill_id'] == -1 and sort['language_id'] == 0:
            if city_id == 0:
                res = obj.filter(end_time__gte=now,
                                 task_title__icontains=sort['keyword'])[
                    sort['page'] * 10:(sort['page'] + 1) * 10]
            else:
                res = obj.filter(city_id=city_id, end_time__gte=now,
                                 task_title__icontains=sort['keyword'])[
                    sort['page'] * 10:(sort['page'] + 1) * 10]
        elif sort['skill_id'] != -1 and sort['language_id'] == 0:
            if city_id == 0:
                res = obj.filter(skill_id=sort['skill_id'], end_time__gte=now, task_title__icontains=sort[
                    'keyword'])[sort['page'] * 10:(sort['page'] + 1) * 10]
            else:
                res = obj.filter(city_id=city_id, end_time__gte=now, skill_id=sort['skill_id'], task_title__icontains=sort[
                    'keyword'])[sort['page'] * 10:(sort['page'] + 1) * 10]
        elif sort['skill_id'] == -1 and sort['language_id'] != 0:
            if city_id == 0:
                res = obj.filter(language_id=sort[
                    'language_id'], end_time__gte=now, task_title__icontains=sort['keyword'])[sort['page'] * 10:(sort['page'] + 1) * 10]
            else:
                res = obj.filter(city_id=city_id, end_time__gte=now, language_id=sort[
                    'language_id'], task_title__icontains=sort['keyword'])[sort['page'] * 10:(sort['page'] + 1) * 10]
        elif sort['skill_id'] != -1 and sort['language_id'] != 0:
            if city_id == 0:
                res = obj.filter(skill_id=sort['skill_id'], end_time__gte=now, language_id=sort[
                    'language_id'], task_title__icontains=sort['keyword'])[sort['page'] * 10:(sort['page'] + 1) * 10]
            else:
                res = obj.filter(city_id=city_id, end_time__gte=now, skill_id=sort['skill_id'], language_id=sort[
                    'language_id'], task_title__icontains=sort['keyword'])[sort['page'] * 10:(sort['page'] + 1) * 10]
        return json.dumps({
            'code': 0,
            'data': list(map(format_task_list, public_api.jsonParse(res.values())))})
    except Exception as e:
        print(e)
        return json.dumps({
            'code': 1,
            'msg': '连接服务器失败'
        })


def format_task_list(item):
    item['task_price'] = item['task_price'].to_eng_string()
    item['release_time'] = item['release_time'].strftime("%Y-%m-%d")
    item['end_time'] = item['end_time'].strftime("%Y-%m-%d")
    del item['user_id']
    del item['task_description']
    return item


def get_recommend_list(request):
    try:
        city_id = json.loads(bytes.decode(request.body)).get('city_id')
        print(city_id)
        now = datetime.datetime.now()
        if city_id == 0:
            count = models.TTask.objects.filter(end_time__gte=now).count()
            index = random.randint(0, count)
            task_list = models.TTask.objects.filter(end_time__gte=now)[
                index:(index + 5)].values('task_id', 'task_title')
        else:
            count = models.TTask.objects.filter(
                end_time__gte=now, city=city_id).count()
            index = random.randint(0, count)
            task_list = models.TTask.objects.filter(city=city_id, end_time__gte=now)[
                index:(index + 5)].values('task_id', 'task_title')
        print(task_list)
        return json.dumps({
            'code': 0,
            'data': list(map(format_recommend_list, task_list))})
    except Exception as e:
        print(e, 111111)
        return json.dumps({
            'code': 1,
            'msg': '连接服务器失败'
        })


def format_recommend_list(item):
    item['task_title'] = item['task_title'][:6]
    return item


def get_resume_list(request):
    try:
        city_id = json.loads(bytes.decode(request.body)).get('city_id')
        sort = json.loads(bytes.decode(request.body)).get('sort')
        print(sort, city_id, sort['skill_id'])
        obj = user_resume_view.UserResumeView.objects
        # 最新发布
        if sort['sort_id'] == 1:
            obj = obj.order_by(
                "expect_salary")
        elif sort['sort_id'] == 2:
            obj = obj.order_by(
                "-expect_salary")
        elif sort['sort_id'] == 3:
            obj = obj.order_by("work_years")
        elif sort['sort_id'] == 4:
            obj = obj.order_by("-work_years")
        if sort['skill_id'] == -1:
            if city_id == 0:
                res = obj.filter(Q(skill_des__icontains=sort['keyword']) | Q(occupation__icontains=sort['keyword']) | Q(experience_des__icontains=sort[
                    'keyword']) | Q(user_nickname__icontains=sort[
                        'keyword']))[
                    sort['page'] * 10:(sort['page'] + 1) * 10]
            else:
                res = obj.filter(Q(skill_des__icontains=sort['keyword']) | Q(occupation__icontains=sort['keyword']) | Q(experience_des__icontains=sort[
                    'keyword']) | Q(user_nickname__icontains=sort[
                        'keyword'])).filter(city_id=city_id)[
                    sort['page'] * 10: (sort['page'] + 1) * 10]
        else:
            if city_id == 0:
                res = obj.filter(Q(skill_des__icontains=sort['keyword']) | Q(occupation__icontains=sort['keyword']) | Q(experience_des__icontains=sort[
                    'keyword']) | Q(user_nickname__icontains=sort[
                        'keyword'])).filter(Q(skill_lables__icontains=str(sort['skill_id'])))[sort['page'] * 10: (sort['page'] + 1) * 10]
            else:
                res = obj.filter(Q(skill_des__icontains=sort['keyword']) | Q(skill_lables=str(sort['skill_id'])) | Q(occupation__icontains=sort['keyword']) | Q(experience_des__icontains=sort[
                    'keyword']) | Q(user_nickname__icontains=sort[
                        'keyword'])).filter(Q(skill_lables__icontains=str(sort['skill_id']))).filter(city_id=city_id)[sort['page'] * 10: (sort['page'] + 1) * 10]
        return json.dumps({
            'code': 0,
            'data': list(map(format_resume_list, public_api.jsonParse(res.values('user_id', 'user_avatar', 'occupation', 'user_nickname', 'expect_salary', 'work_years', 'city_name'))))})
    except Exception as e:
        print(e)
        return json.dumps({
            'code': 1,
            'msg': '连接服务器失败'
        })


def format_resume_list(item):
    item['expect_salary'] = item['expect_salary'].to_eng_string()
    item['occupation'] = item['occupation'][:15]
    return item


def collect_task(request):
    try:
        flag = json.loads(bytes.decode(request.body)).get('flag')
        task_id = json.loads(
            bytes.decode(request.body)).get('task_id')
        user_id = models.TUser.objects.get(open_id=json.loads(
            bytes.decode(request.body)).get('user_id'))
        # 取消收藏
        if flag == 0:
            models.TCollection.objects.filter(
                user=user_id, task_id=task_id).delete()
            return json.dumps({
                'code': 0,
                'data': '取消收藏成功'})
        # 收藏
        else:
            models.TCollection.objects.create(
                user=user_id, task_id=task_id)
            return json.dumps({
                'code': 0,
                'data': '已收藏'})
    except Exception as e:
        print(e)
        return json.dumps({
            'code': 1,
            'msg': '连接服务器失败'
        })


def deliver_task(request):
    try:
        deliver_info = json.loads(bytes.decode(
            request.body)).get('deliver_info')
        task_user_id = json.loads(bytes.decode(
            request.body)).get('task_user_id')
        print(deliver_info, task_user_id)
        is_exist = models.TDeliverRec.objects.filter(
            task=deliver_info['task_id'], user=models.TUser.objects.get(open_id=deliver_info['user_id'])).count()
        if is_exist == 1:
            deliver = models.TDeliverRec.objects.get(
                task=deliver_info['task_id'], user=models.TUser.objects.get(open_id=deliver_info['user_id']))
            deliver.deliver_money = deliver_info['deliver_money']
            deliver.time_spent = deliver_info['time_spent']
            deliver.city = models.TCity.objects.get(
                city_id=deliver_info['city_id'])
            deliver.wechat_num = deliver_info['wechat_num']
            deliver.deliver_description = deliver_info[
                'deliver_description']
            deliver.save()
        else:
            models.TDeliverRec.objects.create(task=models.TTask.objects.get(task_id=deliver_info['task_id']), user=models.TUser.objects.get(open_id=deliver_info['user_id']),
                                              deliver_money=deliver_info['deliver_money'],
                                              time_spent=deliver_info['time_spent'],
                                              city=models.TCity.objects.get(
                                              city_id=deliver_info['city_id']),
                                              wechat_num=deliver_info['wechat_num'],
                                              deliver_description=deliver_info['deliver_description'], status=0)
        user_name = models.TUser.objects.filter(
            open_id=deliver_info['user_id']).values('user_nickname')[0]['user_nickname']
        city_name = models.TCity.objects.filter(
            city_id=deliver_info['city_id']).values('city_name')[0]['city_name']
        message = '''您好：
  我是猿众包的用户【%s】,我对您发布的项目感兴趣，下面是我的投标说明：
  任务报价：%s
  工作周期：%s
  所在地区：%s
  报价说明：%s
  如果您看好我的话，请联系我吧，我的微信号是：%s''' % (
            user_name, deliver_info['deliver_money'], deliver_info['time_spent'], city_name, deliver_info['deliver_description'], deliver_info['wechat_num'])
        print(message)
        models.TMessage.objects.create(user=models.TUser.objects.get(
            user_id=task_user_id), task_id=deliver_info['task_id'], notifyinfo=message, ischeck=0)
        return json.dumps({
            'code': 0,
            'data': '提交成功'})
    except Exception as e:
        print(e)
        return json.dumps({
            'code': 1,
            'msg': '连接服务器失败'
        })


def format_deliver_info(item):
    item['deliver_money'] = item['deliver_money'].to_eng_string()
    item['city_name'] = public_api.jsonParse(
        models.TCity.objects.filter(city_id=item['city_id']).values('city_name'))[0]['city_name']
    del item['deliver_time']
    del item['user_id']
    return item


def hire(request):
    try:
        user_id = json.loads(bytes.decode(
            request.body)).get('user_id')
        hire_user_id = json.loads(bytes.decode(
            request.body)).get('hire_user_id')
        hire_info = json.loads(bytes.decode(
            request.body)).get('hire_info')
        wechat_num = json.loads(bytes.decode(
            request.body)).get('wechat_num')
        print(user_id, hire_user_id, hire_info, wechat_num)
        user_name = models.TUser.objects.filter(
            open_id=user_id).values('user_nickname')[0]['user_nickname']
        message = '''来自猿众包雇主【%s】的消息：
  %s
  如果您感兴趣，请联系他吧！
  雇主微信号：%s''' % (
            user_name, hire_info, wechat_num)
        print(message)
        models.TMessage.objects.create(user=models.TUser.objects.get(
            user_id=hire_user_id), notifyinfo=message, ischeck=0)
        return json.dumps({
            'code': 0,
            'data': '提交成功'})
    except Exception as e:
        print(e)
        return json.dumps({
            'code': 1,
            'msg': '连接服务器失败'
        })


def get_my_task(request):
    try:
        user_id = json.loads(bytes.decode(
            request.body)).get('user_id')
        print(user_id)
        task_list = public_api.jsonParse(task_user_view.TaskUserView.objects.filter(user_id=models.TUser.objects.filter(
            open_id=user_id).values('user_id')[0]['user_id']).values('task_id', 'task_title', 'task_price', 'post_num'))
        print(task_list)
        return json.dumps({
            'code': 0,
            'data': list(map(format_my_task, task_list))})
    except Exception as e:
        print(e)
        return json.dumps({
            'code': 1,
            'msg': '连接服务器失败'
        })


def format_my_task(item):
    item['task_price'] = item['task_price'].to_eng_string()
    return item


def delete_my_task(request):
    try:
        user_id = json.loads(bytes.decode(
            request.body)).get('user_id')
        task_id = json.loads(bytes.decode(
            request.body)).get('task_id')
        print(user_id, task_id)
        models.TTask.objects.filter(
            task_id=task_id, user=models.TUser.objects.get(open_id=user_id)).delete()
        return json.dumps({
            'code': 0,
            'data': '删除成功'})
    except Exception as e:
        print(e)
        return json.dumps({
            'code': 1,
            'msg': '连接服务器失败'
        })


def get_deliver_task(request):
    try:
        user_id = json.loads(bytes.decode(
            request.body)).get('user_id')
        print(user_id)
        deliver_ids = public_api.jsonParse(models.TDeliverRec.objects.filter(
            user=models.TUser.objects.get(open_id=user_id)).values('task', 'status'))
        print(deliver_ids)
        task_list = public_api.jsonParse(task_user_view.TaskUserView.objects.filter(
            task_id__in=list(map(lambda x: x['task'], deliver_ids))).values('task_id', 'task_title', 'task_price', 'post_num'))
        print(task_list)
        return json.dumps({
            'code': 0,
            'data': list(map(format_deliver_task, task_list, deliver_ids))})
    except Exception as e:
        print(e)
        return json.dumps({
            'code': 1,
            'msg': '连接服务器失败'
        })


def format_deliver_task(item, status):
    item['task_price'] = item['task_price'].to_eng_string()
    if status['status'] == 0:
        item['status'] = '未查看'
    else:
        item['status'] = '已查看'
    return item


def delete_deliver_task(request):
    try:
        user_id = json.loads(bytes.decode(
            request.body)).get('user_id')
        task_id = json.loads(bytes.decode(
            request.body)).get('task_id')
        print(user_id, task_id)
        models.TDeliverRec.objects.filter(
            task=task_id, user=models.TUser.objects.get(open_id=user_id)).delete()
        return json.dumps({
            'code': 0,
            'data': '删除成功'})
    except Exception as e:
        print(e)
        return json.dumps({
            'code': 1,
            'msg': '连接服务器失败'
        })
