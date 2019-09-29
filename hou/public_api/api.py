from django.conf import settings
from public_api import citys
from public_api import models
import json
import requests


# 序列化查询结果
def jsonParse(data):
    res = []
    for item in data:
        if item not in res:
            res.append(item)
    return res


# 获取城市列表
def get_city_list():
    try:
        return json.dumps({
            'code': 0,
            'data': citys.CITYS
        })
    except:
        return json.dumps({
            'code': 1,
            'msg': '获取数据失败'
        })


# 查询城市
def search_city(request):
    try:
        keyword = json.loads(bytes.decode(request.body)).get('keyword')
        city_list = citys.CITYS
        res = []
        for city in city_list:
            if keyword in city['cityName']:
                res.append(city)
        return json.dumps({'code': 0, 'data': res})
    except:
        return json.dumps({
            'code': 1,
            'msg': '连接服务器失败'
        })


# 根据经纬度获取城市
def get_city(request):
    try:
        latitude = json.loads(bytes.decode(request.body)).get('latitude')
        longitude = json.loads(bytes.decode(request.body)). get('longitude')
        url = settings.CITY_API + str(latitude) + ',' + str(longitude)
        city_name = json.loads(requests.get(url).text.replace('市', ''))[
            'result']['address_component']['city']
        city_id = jsonParse(
            models.TCity.objects.filter(city_name=city_name))[0].city_id
        return json.dumps(
            {'code': 0,
             'data': {
                 'city_id': city_id,
                 'city_name': city_name
             }})
    except:
        return json.dumps({
            'code': 1,
            'msg': '连接服务器失败'
        })


def set_task_status(task_id, status_code):
    try:
        task_info = models.TTask.get(task_id=task_id)
        task_info.status = status_code
        task_info.save()
        return True
    except:
        return False
