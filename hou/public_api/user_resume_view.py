from .models import *


class UserResumeView(models.Model):
    user_id = models.CharField(
        db_column='USER_ID', primary_key=True, max_length=36)
    user_avatar = models.CharField(db_column='USER_AVATAR', max_length=100)
    user_nickname = models.CharField(db_column='USER_NICKNAME', max_length=50)
    company = models.CharField(db_column='COMPANY', max_length=100)
    occupation = models.CharField(db_column='OCCUPATION', max_length=50)
    work_years = models.IntegerField(db_column='WORK_YEARS')
    expect_salary = models.DecimalField(
        db_column='EXPECT_SALARY', max_digits=10, decimal_places=2)
    city_id = models.IntegerField(db_column='CITY_ID')
    city_name = models.IntegerField(db_column='CITY_NAME')
    skill_lables = models.CharField(
        db_column='SKILL_LABLES', max_length=100)
    experience_des = models.CharField(
        db_column='EXPERIENCE_DES', max_length=5000)
    skill_des = models.CharField(
        db_column='SKILL_DES', max_length=5000)
    experience_url = models.CharField(
        db_column='EXPERIENCE_URL', max_length=500)

    class Meta:
        managed = False
        db_table = 'V_USER_RESUME'
