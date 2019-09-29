// pages/my_skill/my_skill.js
var userFunc = require('../../libs/js/user.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_info: {},
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
      experience_des:'',
      experience_url: ''
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    userFunc.getResumeInfo(this, getApp().globalData.openId,0)
    this.setData({
      user_info: getApp().globalData.userInfo,
      'user_resume_info.user_id': getApp().globalData.openId,
      'user_resume_info.city.city_id': getApp().globalData.city.cityId,
      'user_resume_info.city.city_name': getApp().globalData.city.cityName
    })
  },
  chooseCity() {
    wx.navigateTo({
      url: '../choose_city/choose_city?fromPage=my_skill'
    })
  },
  setInput: function(e) {
    var flag = e.currentTarget.dataset.flag
    var key = 'user_resume_info.' + flag
    this.setData({
      [key]: e.detail.value
    })
  },
  saveResumInfo: function() {
    userFunc.saveResumInfo(this)
  },
  setSkill(e) {
    var index;
    for (var i = 0; i < this.data.skill_item.length; i++) {
      if (e.currentTarget.dataset.id == this.data.skill_item[i].id) {
        index = i
      }
    }
    //设置选中
    if (e.currentTarget.dataset.flag == 0) {
      var skill_lables = this.data.user_resume_info.skill_lables
      skill_lables.splice(this.data.user_resume_info.skill_lables.indexOf((e.currentTarget.dataset.id)), 1)
      this.setData({
        ['skill_item[' + index + '].ischeck']: 0,
        'user_resume_info.skill_lables': skill_lables
      })
    } else {
      var skill_lables = this.data.user_resume_info.skill_lables
      skill_lables.push(e.currentTarget.dataset.id)
      this.setData({
        ['skill_item[' + index + '].ischeck']: 1,
        'user_resume_info.skill_lables': skill_lables
      })
    }
    console.log(this.data.user_resume_info.skill_lables)
  }
})