# -*- coding: utf-8 -*-
# @Author: Administrator
# @Date:   2019-05-18 14:34:24
# @Last Modified by:   Administrator
# @Last Modified time: 2019-05-18 15:19:50
from .models import *


class UserCollectionView(models.Model):
    # Field name made lowercase.
    user_id = models.CharField(
        db_column='USER_ID', max_length=36)
    task_id = models.CharField(
        db_column='TASK_ID', primary_key=True, max_length=36)
    collect_time = models.DateTimeField(db_column='COLLECT_TIME')
    end_time = models.DateTimeField(db_column='END_TIME')
    task_title = models.CharField(db_column='TASK_TITLE', max_length=50)
    task_price = models.DecimalField(
        db_column='TASK_PRICE', max_digits=10, decimal_places=2)
    post_num = models.IntegerField(db_column='POST_NUM')
    # is_deliver = models.IntegerField(db_column='IS_DELIVER')

    class Meta:
        managed = False
        db_table = 'V_USER_COLLECTION'
