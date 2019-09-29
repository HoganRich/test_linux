from crowdsourcing import settings
import pymysql
import requests
import scrapy_data
import uuid
import os
import time
import datetime
import random
import json
import sys
sys.path.append('..')

CITY_API = 'https://wxapp.58.com/load/city?thirdKey=dOMzCgrEgA1Nwc79DILpcol3RelOall7lVTEs3yYnTRV0oWKna9HWCYGTOvpnQwA&appCode=11'

db = pymysql.connect(settings.DATABASES['default']['HOST'], settings.DATABASES['default']['USER'],
                     settings.DATABASES['default']['PASSWORD'], settings.DATABASES['default']['NAME'], charset='utf8mb4')
cursor = db.cursor()

languages = [{
    'id': 0,
    'language_name': '不限',
}, {
    'id': 1,
    'language_name': 'Java',
}, {
    'id': 2,
    'language_name': 'C',
}, {
    'id': 3,
    'language_name': 'Python',
}, {
    'id': 4,
    'language_name': 'C++',
}, {
    'id': 5,
    'language_name': 'C#',
}, {
    'id': 6,
    'language_name': 'PHP',
}, {
    'id': 7,
    'language_name': 'JavaScript',
}, {
    'id': 8,
    'language_name': 'SQL',
}, {
    'id': 9,
    'language_name': 'Perl',
}, {
    'id': 10,
    'language_name': 'GO',
}, {
    'id': 11,
    'language_name': 'MATLAB',
}, {
    'id': 12,
    'language_name': '其它语言',
}]

skills = [{
    'id': 0,
    'skill_name': 'IOS开发',
}, {
    'id': 1,
    'skill_name': 'Android开发',
}, {
    'id': 2,
    'skill_name': '软件开发',
}, {
    'id': 3,
    'skill_name': 'Web开发',
}, {
    'id': 4,
    'skill_name': '微信小程序',
}, {
    'id': 5,
    'skill_name': '公众号开发',
}, {
    'id': 6,
    'skill_name': '脚本开发',
}, {
    'id': 7,
    'skill_name': '数据分析',
}, {
    'id': 8,
    'skill_name': '数据采集',
}, {
    'id': 9,
    'skill_name': '程序二开',
}, {
    'id': 10,
    'skill_name': '其它',
}]

first_name = ['赵', '钱', '孙', '李', '周', '吴', '郑', '王',
              '冯', '陈', '褚', '卫', '蒋', '沈', '韩', '杨', '张', '李']
second_name = ['豫', '章', '故', '郡', '洪', '都', '新', '府', '星', '分', '翼', '轸', '地', '接', '衡', '庐', '襟', '三', '江', '', '而', '带', '五', '湖',
               '控', '蛮', '荆', '而', '引', '瓯', '越', '物', '华', '天', '宝', '龙', '光', '射', '牛', '斗', '之', '墟', '人', '杰', '地', '灵', '徐', '孺', '饯', '子']
users = [{
    'user_id': '1',
    'user_avatar': 'https://img2.woyaogexing.com/2019/04/23/3b7e1c65789f447196e261e65504a674!400x400.jpeg',
    'user_nickname': 'Ricky',
}, {
    'user_id': '2',
    'user_avatar': 'https://img2.woyaogexing.com/2019/04/23/62b00b919f494d3dbe49a630d5af5366!400x400.jpeg',
    'user_nickname': '罗东升',
}, {
    'user_id': '3',
    'user_avatar': 'https://img2.woyaogexing.com/2019/04/23/04811c334fac6a6f!400x400_big.jpg',
    'user_nickname': '何鹏洲',
}]


def strTimeProp(start, end, prop, frmt):
    stime = time.mktime(time.strptime(start, frmt))
    etime = time.mktime(time.strptime(end, frmt))
    ptime = stime + prop * (etime - stime)
    return int(ptime)


def randomDate(start, end, frmt='%Y-%m-%d'):
    return time.strftime(frmt, time.localtime(strTimeProp(start, end, random.random(), frmt)))


def randomDateList(start, end, frmt='%Y-%m-%d'):
    return randomDate(start, end, frmt)


def init_city():
    citys = [{'cityId': 0, 'cityName': '不限'}]
    citys.extend(json.loads(json.loads(requests.get(CITY_API).text)['data']))
    for city in citys:
        if city['cityId'] != -1:
            print('插入城市：%d\t%s' % (city['cityId'], city['cityName']))
            INSERT_SQL = '''
                INSERT INTO T_CITY VALUES(%d,'%s');
                ''' % (city['cityId'], city['cityName'])
            cursor.execute(INSERT_SQL)
            db.commit()
    print('初始化城市完成')


def init_language():
    for language in languages:
        print('插入语言：%d\t%s' % (language['id'], language['language_name']))
        INSERT_SQL = '''
                INSERT INTO T_LANGUAGE VALUES(%d,'%s');
                ''' % (language['id'], language['language_name'])
        cursor.execute(INSERT_SQL)
        db.commit()
    print('初始化开发语言完成')


def init_skill():
    for skill in skills:
        print('插入技能：%d\t%s' % (skill['id'], skill['skill_name']))
        INSERT_SQL = '''
                INSERT INTO T_SKILL VALUES(%d,'%s');
                ''' % (skill['id'], skill['skill_name'])
        cursor.execute(INSERT_SQL)
        db.commit()
    print('初始化开发类型完成')


def init_user_task():
    i = 1
    for item in scrapy_data.scrapy_data():
        try:
            task, user = item[0], item[1]
            print('插入用户：%d\t%s' % (i, user['user_nickname']))
            INSERT_SQL = '''
                INSERT INTO T_USER  VALUES('%s','%s','%s','%s');
                ''' % (str(i), str(uuid.uuid4()), user['user_avatar'], user['user_nickname'])
            cursor.execute(INSERT_SQL)
            # db.commit()
            print('初始化任务：', i)
            cursor.execute(
                '''INSERT INTO T_TASK(USER_ID,END_TIME,
                TASK_TITLE,TASK_DESCRIPTION,TASK_PRICE,CITY_ID,LANGUAGE_ID,SKILL_ID)
                VALUES('%s','%s','%s','%s','%s','%s','%s','%s');''' %
                (str(i), randomDateList('2019-05-01', '2019-05-31'),
                    task['task_title'].replace("'", ''), task['task_description'].replace(
                        "'", ''), task['task_price'],
                    random.choice([0, 1, 2, 3, 4, 5, 18, 37, 79, 102,
                                   122, 158, 172, 188, 265, 414, 483, 556, 783]),
                 random.randint(0, 12), random.randint(0, 10)))
            db.commit()
            i += 1
        except Exception as e:
            print(e)
            i += 1
            continue
    print('初始化任务和用户完成')


def init_resume():
    i = 2601
    for user in scrapy_data.scrapy_clerk():
        try:
            print('插入用户：%d\t%s' % (i, user['user_nickname']))
            INSERT_SQL = '''
                    INSERT INTO T_USER VALUES('%s','%s','%s','%s');
                    ''' % (str(i), str(uuid.uuid4()), user['user_avatar'], user['user_nickname'])
            cursor.execute(INSERT_SQL)
            cursor.execute('''
                INSERT INTO T_USER_RESUME VALUES('%s','%s','%s','%s','%s','%s','%s','%s','%s','%s')
                ''' % (str(i), user['company'], user['occupation'], user['work_years'], user['expect_salary'], random.choice([0, 1, 2, 3, 4, 5, 18, 37, 79, 102, 122, 158, 172, 188, 265, 414, 483, 556, 783]), user['skill_labels'], user['skill_des'], user['experience_des'], ''))
            db.commit()
            i += 1
        except Exception as e:
            print(e)
            i += 1
            continue


def create_view():
    CREATE_SQL_1 = '''
CREATE OR REPLACE  VIEW V_TASK_USER  AS SELECT T_TASK.*,
T_USER.USER_AVATAR,T_USER.USER_NICKNAME,T_SKILL.NAME SKILL_NAME,
T_LANGUAGE.NAME LANGUAGE_NAME,T_CITY.CITY_NAME,(SELECT COUNT(*) FROM T_DELIVER_REC WHERE 
T_DELIVER_REC.TASK_ID=T_TASK.TASK_ID) POST_NUM FROM 
T_TASK,T_USER,T_SKILL,T_LANGUAGE,T_CITY
WHERE T_TASK.USER_ID=T_USER.USER_ID AND T_TASK.SKILL_ID=T_SKILL.ID AND T_TASK.LANGUAGE_ID=T_LANGUAGE.ID AND
 T_TASK.CITY_ID=T_CITY.CITY_ID ;
    '''
    CREATE_SQL_2 = '''
CREATE OR REPLACE  VIEW V_USER_RESUME  AS SELECT T_USER_RESUME.*,
T_USER.USER_AVATAR,T_USER.USER_NICKNAME,T_CITY.CITY_NAME
FROM T_USER_RESUME,T_USER,T_CITY
WHERE T_USER_RESUME.USER_ID=T_USER.USER_ID AND T_USER_RESUME.CITY_ID=T_CITY.CITY_ID;
    '''
    CREATE_SQL_3 = '''
CREATE OR replace VIEW V_USER_COLLECTION AS SELECT T.*,V.TASK_TITLE,V.TASK_PRICE,
V.END_TIME,V.POST_NUM FROM V_TASK_USER V,T_COLLECTION T WHERE
V.TASK_ID=T.TASK_ID ;
    '''
    cursor.execute(CREATE_SQL_1)
    cursor.execute(CREATE_SQL_2)
    cursor.execute(CREATE_SQL_3)
    db.commit()


def create_index():
    cursor.execute('CREATE INDEX I_TASK_PRICE ON T_TASK (TASK_PRICE);')
    cursor.execute(
        'CREATE INDEX I_RELEASE_TIME ON T_TASK (RELEASE_TIME);')
    db.commit()


if __name__ == "__main__":
    # init_city()
    # init_language()
    # init_skill()
    # init_user_task()
    # init_resume()
    # create_view()
    # create_index()
    # cursor.close()
    # db.close()
    if os.system('python ../manage.py inspectdb > ../public_api/models.py') == 0:
        print('映射成功')
