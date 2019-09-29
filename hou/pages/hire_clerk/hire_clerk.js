// pages/hire_clerk/hire_clerk.js
var taskFunc = require('../../libs/js/task.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hire_user_id: '',
    hire_info: '',
    wechat_num: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options.user_id)
    this.setData({
      hire_user_id: options.user_id,
    })
  },
  setHireInfo:function(e){
    this.setData({
      hire_info:e.detail.value
    })
  },
  setWechatNum: function (e) {
    this.setData({
      wechat_num: e.detail.value
    })
  },
  hire: function() {
    taskFunc.hire(this)
  }
})