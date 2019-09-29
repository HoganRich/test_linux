import requests
from lxml import etree
import logging
import random
# from fake_useragent import UserAgent
# USER_AGENT = UserAgent()
logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
HOST = 'https://www.yuanjisong.com/job/allcity/page'
first_name = ['赵', '钱', '孙', '李', '周', '吴', '郑', '王',
              '冯', '陈', '褚', '卫', '蒋', '沈', '韩', '杨', '张', '李']
second_name = ['豫', '章', '故', '郡', '洪', '都', '新', '府', '星', '分', '翼', '轸', '地', '接', '衡', '庐', '襟', '三', '江', '', '而', '带', '五', '湖',
               '控', '蛮', '荆', '而', '引', '瓯', '越', '物', '华', '天', '宝', '龙', '光', '射', '牛', '斗', '之', '墟', '人', '杰', '地', '灵', '徐', '孺', '饯', '子']


def scrapy_data():
    for i in range(1, 131):
        # header = {'User-Agent': USER_AGENT.random}
        # print(header)
        res = requests.get(HOST + str(i), verify=False)
        data = etree.HTML(res.text)
        for item in data.xpath("//*[@class='weui_panel weui_panel_access weui_panel_access_adapt db_adapt margin-top-2 ']"):
            task = {}
            user = {}
            task['task_id'] = item.xpath(
                'a[1]/@href')[0].split('/')[-1]
            task['user_id'] = item.xpath(
                'div[@class="job_list_item_div"][1]/div[2]/a[1]/@href')[0].split('/')[-1]
            task['task_title'] = item.xpath(
                'a[1]/div[1]/div[1]/text()')[0].strip()
            task['task_description'] = item.xpath(
                'div[@class="job_list_item_div"]//p[@class="media_desc_adapt "]/text()')[0].replace('\r\n\r\n', '\n').replace('\r\n', '\n')
            task['task_price'] = item.xpath(
                "div[@class='job_list_item_div']//span[@class='rixin-text-jobs']/text()")[0]
            # user['user_id'] = item.xpath(
            # 'div[@class="job_list_item_div"][1]/div[2]/a[1]/@href')[0].split('/')[-1]
            # [0].split('/')[-2][:36]
            user['user_avatar'] = item.xpath(
                'div[@class="job_list_item_div"][1]/div[2]/a[1]/div[1]/img[1]/@src')[0]
            if not user['user_avatar'].startswith('http'):
                user['user_avatar'] = 'https://www.yuanjisong.com' + \
                    user['user_avatar']
            user['user_nickname'] = str(item.xpath(
                "div[@class='job_list_item_div']//h4/text()")[0])
            yield (task, user)
        i += 1


def scrapy_clerk():
    # 1041
    for i in range(1, 1401):
        # header = {'User-Agent': USER_AGENT.random}
        # print(header)
        res = requests.get(
            'https://www.yuanjisong.com/consultant/allcity/page' + str(i), verify=False)
        data = etree.HTML(res.text)
        for item in data.xpath("//*[@class='weui_panel weui_panel_access weui_panel_access_adapt db_adapt margin-top-2']"):
            user_id = item.xpath(
                'a[1]/@href')[0].split('/')[-1]
            yield scrapy_detail(user_id)
        i += 1


def scrapy_detail(user_id):
    user = {'user_wechat_num': user_id}
    res = requests.get(
        'https://www.yuanjisong.com/consultant/' + user_id, verify=False)
    data = etree.HTML(res.text)
    user['user_avatar'] = data.xpath(
        "//*[@class='col-sm-2 col-left-0']/img/@src")[0]
    if not user['user_avatar'].startswith('http'):
        user['user_avatar'] = 'https://www.yuanjisong.com' + \
            user['user_avatar']
    user['user_nickname'] = data.xpath(
        "/html/body/div[2]/div[1]/div[2]/div[2]/div[1]/div/div[1]/h1/text()")[0].replace('\t', '')
    user['company'] = data.xpath(
        "/html/body/div[2]/div[1]/div[2]/div[2]/div[2]/div/ul/li[2]/text()")[0].replace('\t', '')
    user['occupation'] = data.xpath(
        "/html/body/div[2]/div[1]/div[2]/div[2]/div[1]/h2/text()")[0]
    user['work_years'] = data.xpath(
        "/html/body/div[2]/div[1]/div[2]/div[2]/div[3]/div/ul/li[2]/text()")[0].replace('年', '').replace('\t', '').replace('\r\n', '')
    user['expect_salary'] = data.xpath(
        "/html/body/div[2]/div[1]/div[2]/div[2]/div[4]/div/ul/li[2]/text()")[0].split('/')[0].replace('元', '')
    user['skill_labels'] = create_skill_labels()
    user['skill_des'] = ''.join(data.xpath(
        "/html/body/div[2]/div[1]/div[3]/div/div/p//text()"))
    user['experience_des'] = '.'.join(data.xpath(
        "/html/body/div[2]/div[1]/div[4]/div/div/p//text()"))
    return user


def create_skill_labels():
    skill_labels = []
    # 长度
    for i in range(0, random.randint(0, 10)):
        skill_labels.append(str(random.randint(0, 10)))
    return ','.join(skill_labels)


if __name__ == "__main__":
    # header = {'User-Agent': USER_AGENT.random}
    # print(header)
    # for item in scrapy_data():
        # print(item)
    for item in scrapy_clerk():
        print(item)
