from .models import *


class TaskUserView(models.Model):
    # Field name made lowercase.
    task_id = models.CharField(
        db_column='TASK_ID', primary_key=True, max_length=36)
    user_id = models.CharField(
        db_column='USER_ID', max_length=36)
    # Field name made lowercase.
    # Field name made lowercase.
    city_id = models.IntegerField(db_column='CITY_ID')
    # Field name made lowercase.
    release_time = models.DateTimeField(db_column='RELEASE_TIME')
    # Field name made lowercase.
    end_time = models.DateField(db_column='END_TIME')
    # Field name made lowercase.
    task_title = models.CharField(db_column='TASK_TITLE', max_length=50)
    # Field name made lowercase.
    task_description = models.CharField(
        db_column='TASK_DESCRIPTION', max_length=5000)
    # Field name made lowercase.
    task_price = models.DecimalField(
        db_column='TASK_PRICE', max_digits=10, decimal_places=2)
    # Field name made lowercase.
    # Field name made lowercase.
    language_id = models.IntegerField(
        db_column='LANGUAGE_ID')
    language_name = models.CharField(db_column='LANGUAGE_NAME', max_length=20)
    # Field name made lowercase.
    # Field name made lowercase.
    # Field name made lowercase.
    skill_id = models.IntegerField(db_column='SKILL_ID')
    skill_name = models.CharField(db_column='SKILL_NAME', max_length=20)
    # Field name made lowercase.
    city_name = models.CharField(db_column='CITY_NAME', max_length=5)
    # Field name made lowercase.
    user_avatar = models.CharField(db_column='USER_AVATAR', max_length=100)
    # Field name made lowercase.
    user_nickname = models.CharField(db_column='USER_NICKNAME', max_length=50)
    # Field name made lowercase.
    post_num = models.IntegerField(db_column='POST_NUM')

    class Meta:
        managed = False
        db_table = 'V_TASK_USER'
