from public_api import models
from public_api import api as public_api
import json


def get_clerk_list(request):
    try:
        sort =
        res = public_api.jsonParse(
            models.TUserResume.objects.filter().values())
        return json.dumps({
            'code': 0,
            'data': res})
    except:
        return json.dumps({
            'code': 1,
            'msg': '连接服务器失败'
        })


def get_clerk_detail(request):
    try:
        clerk_id = json.loads(bytes.decode(request.body)).get('clerk_id')
        res = public_api.jsonParse(
            models.TUserResume.objects.filter(user=clerk_id).values())
        return json.dumps({
            'code': 0,
            'data': res})
    except:
        return json.dumps({
            'code': 1,
            'msg': '连接服务器失败'
        })
