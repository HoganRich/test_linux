// pages/my_skill/my_skill.js
var userFunc = require('../../libs/js/user.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    skill_item: [],
    user_resume_info: {
      city: {
        city_id: 0,
        city_name: '不限'
      },
      company: '',
      occupation: '',
      work_years: '',
      expect_salary: '',
      skill_lables: [],
      skill_des: '',
      experience_des: '',
      experience_url: '',
      user_wechat_num: ''
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    userFunc.getResumeInfo(this, options.user_id, 1)
  },
  chooseCity() {
    wx.navigateTo({
      url: '../choose_city/choose_city?fromPage=my_skill'
    })
  },
  setInput: function (e) {
    var flag = e.currentTarget.dataset.flag
    var key = 'user_resume_info.' + flag
    this.setData({
      [key]: e.detail.value
    })
  },
  hire:function(){
    wx.navigateTo({
      url: '../hire_clerk/hire_clerk?user_id='+this.data.user_resume_info.user_id,
    })
  }
})