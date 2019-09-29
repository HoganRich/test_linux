# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey has `on_delete` set to the desired behavior.
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class TBanner(models.Model):
    banner_id = models.AutoField(db_column='BANNER_ID', primary_key=True)  # Field name made lowercase.
    info_url = models.CharField(db_column='INFO_URL', max_length=200)  # Field name made lowercase.
    img_url = models.CharField(db_column='IMG_URL', max_length=500)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'T_BANNER'


class TBrowseRec(models.Model):
    browse_id = models.AutoField(db_column='BROWSE_ID', primary_key=True)  # Field name made lowercase.
    user = models.ForeignKey('TUser', models.DO_NOTHING, db_column='USER_ID')  # Field name made lowercase.
    task = models.ForeignKey('TTask', models.DO_NOTHING, db_column='TASK_ID')  # Field name made lowercase.
    browse_time = models.DateTimeField(db_column='BROWSE_TIME')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'T_BROWSE_REC'


class TCity(models.Model):
    city_id = models.IntegerField(db_column='CITY_ID', primary_key=True)  # Field name made lowercase.
    city_name = models.CharField(db_column='CITY_NAME', max_length=5)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'T_CITY'


class TCollection(models.Model):
    user = models.ForeignKey('TUser', models.DO_NOTHING, db_column='USER_ID', primary_key=True)  # Field name made lowercase.
    task = models.ForeignKey('TTask', models.DO_NOTHING, db_column='TASK_ID')  # Field name made lowercase.
    collect_time = models.DateTimeField(db_column='COLLECT_TIME')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'T_COLLECTION'
        unique_together = (('user', 'task'),)


class TDeliverRec(models.Model):
    task = models.ForeignKey('TTask', models.DO_NOTHING, db_column='TASK_ID', primary_key=True)  # Field name made lowercase.
    user = models.ForeignKey('TUser', models.DO_NOTHING, db_column='USER_ID')  # Field name made lowercase.
    deliver_time = models.DateTimeField(db_column='DELIVER_TIME')  # Field name made lowercase.
    deliver_money = models.DecimalField(db_column='DELIVER_MONEY', max_digits=10, decimal_places=2)  # Field name made lowercase.
    time_spent = models.IntegerField(db_column='TIME_SPENT')  # Field name made lowercase.
    city = models.ForeignKey(TCity, models.DO_NOTHING, db_column='CITY_ID')  # Field name made lowercase.
    deliver_description = models.CharField(db_column='DELIVER_DESCRIPTION', max_length=1000)  # Field name made lowercase.
    wechat_num = models.CharField(db_column='WECHAT_NUM', max_length=36)  # Field name made lowercase.
    status = models.IntegerField(db_column='STATUS')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'T_DELIVER_REC'
        unique_together = (('task', 'user'),)


class TLanguage(models.Model):
    id = models.IntegerField(db_column='ID', primary_key=True)  # Field name made lowercase.
    name = models.CharField(db_column='NAME', max_length=10)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'T_LANGUAGE'


class TMessage(models.Model):
    id = models.AutoField(db_column='ID', primary_key=True)  # Field name made lowercase.
    user = models.ForeignKey('TUser', models.DO_NOTHING, db_column='USER_ID')  # Field name made lowercase.
    task_id = models.IntegerField(db_column='TASK_ID', blank=True, null=True)  # Field name made lowercase.
    notifyinfo = models.CharField(db_column='NOTIFYINFO', max_length=5000)  # Field name made lowercase.
    notifytime = models.DateTimeField(db_column='NOTIFYTIME')  # Field name made lowercase.
    ischeck = models.IntegerField(db_column='ISCHECK')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'T_MESSAGE'


class TRecommend(models.Model):
    user = models.ForeignKey('TUser', models.DO_NOTHING, db_column='USER_ID', primary_key=True)  # Field name made lowercase.
    task = models.ForeignKey('TTask', models.DO_NOTHING, db_column='TASK_ID')  # Field name made lowercase.
    ratting = models.DecimalField(db_column='RATTING', max_digits=12, decimal_places=2)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'T_RECOMMEND'
        unique_together = (('user', 'task'),)


class TSearchRec(models.Model):
    search_id = models.AutoField(db_column='SEARCH_ID', primary_key=True)  # Field name made lowercase.
    user = models.ForeignKey('TUser', models.DO_NOTHING, db_column='USER_ID')  # Field name made lowercase.
    keyword = models.CharField(db_column='KEYWORD', max_length=50)  # Field name made lowercase.
    search_time = models.DateTimeField(db_column='SEARCH_TIME')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'T_SEARCH_REC'


class TSkill(models.Model):
    id = models.IntegerField(db_column='ID', primary_key=True)  # Field name made lowercase.
    name = models.CharField(db_column='NAME', max_length=20)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'T_SKILL'


class TTask(models.Model):
    task_id = models.AutoField(db_column='TASK_ID', primary_key=True)  # Field name made lowercase.
    user = models.ForeignKey('TUser', models.DO_NOTHING, db_column='USER_ID')  # Field name made lowercase.
    release_time = models.DateTimeField(db_column='RELEASE_TIME')  # Field name made lowercase.
    end_time = models.DateTimeField(db_column='END_TIME')  # Field name made lowercase.
    task_title = models.CharField(db_column='TASK_TITLE', max_length=50)  # Field name made lowercase.
    task_description = models.CharField(db_column='TASK_DESCRIPTION', max_length=5000)  # Field name made lowercase.
    task_price = models.DecimalField(db_column='TASK_PRICE', max_digits=10, decimal_places=2)  # Field name made lowercase.
    city = models.ForeignKey(TCity, models.DO_NOTHING, db_column='CITY_ID')  # Field name made lowercase.
    language = models.ForeignKey(TLanguage, models.DO_NOTHING, db_column='LANGUAGE_ID')  # Field name made lowercase.
    skill = models.ForeignKey(TSkill, models.DO_NOTHING, db_column='SKILL_ID', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'T_TASK'


class TUser(models.Model):
    user_id = models.AutoField(db_column='USER_ID', primary_key=True)  # Field name made lowercase.
    open_id = models.CharField(db_column='OPEN_ID', max_length=36)  # Field name made lowercase.
    user_avatar = models.CharField(db_column='USER_AVATAR', max_length=500)  # Field name made lowercase.
    user_nickname = models.CharField(db_column='USER_NICKNAME', max_length=50)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'T_USER'


class TUserResume(models.Model):
    user = models.ForeignKey(TUser, models.DO_NOTHING, db_column='USER_ID', primary_key=True)  # Field name made lowercase.
    company = models.CharField(db_column='COMPANY', max_length=100, blank=True, null=True)  # Field name made lowercase.
    occupation = models.CharField(db_column='OCCUPATION', max_length=50, blank=True, null=True)  # Field name made lowercase.
    work_years = models.IntegerField(db_column='WORK_YEARS')  # Field name made lowercase.
    expect_salary = models.DecimalField(db_column='EXPECT_SALARY', max_digits=10, decimal_places=2)  # Field name made lowercase.
    city = models.ForeignKey(TCity, models.DO_NOTHING, db_column='CITY_ID')  # Field name made lowercase.
    skill_lables = models.CharField(db_column='SKILL_LABLES', max_length=100, blank=True, null=True)  # Field name made lowercase.
    skill_des = models.CharField(db_column='SKILL_DES', max_length=5000)  # Field name made lowercase.
    experience_des = models.CharField(db_column='EXPERIENCE_DES', max_length=5000)  # Field name made lowercase.
    experience_url = models.CharField(db_column='EXPERIENCE_URL', max_length=500, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'T_USER_RESUME'
