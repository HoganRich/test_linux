// pages/index/index.js
var userFuc = require('../../libs/js/user.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showflag: false
  },
  onLoad: function(options) {
    var that=this
    wx.showLoading({
      title: '加载中',
    })
    //从本地读取用户信息，赋值给globalData,没有值则调用登录
    wx.getStorage({
      key: 'userInfo',
      success: function(res) {
        app.globalData.userInfo = res
        wx.getStorage({
          key: 'openId',
          success: function(res) {
            if (res.data != null) {
              app.globalData.openId = res.data
              userFuc.checkSignup(that)
            }
          },
          fail: function(res) {
            console.log(1111111)
            userFuc.login(that)
          }
        })
      },
      fail: function(res) {
        console.log(222222)
        userFuc.login(that)
      }
    })
  },
  getInfo: function(e) {
    wx.showLoading({
      title: '获取信息中',
      icon: 'none'
    })
    app.globalData.userInfo = e.detail.userInfo
    wx.setStorage({
      key: 'userInfo',
      data: e.detail.userInfo,
    })
    console.log(e.detail.userInfo)
    userFuc.signUp()
  },
  getPhoneNumber: function(e) {
    console.log(e)
  }
})