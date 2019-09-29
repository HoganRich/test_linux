from django.conf import settings
import requests
import json


def get_openid(request):
    if request.method == 'POST':
        code = json.loads(bytes.decode(request.body)).get('code')
        url = settings.OPENIDAPI + '&js_code=' + code
        return requests.get(url).text
    else:
        return '请求方法错误'
