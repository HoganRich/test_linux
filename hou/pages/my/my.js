// pages/my/my.js
var userFuc = require('../../libs/js/user.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    count:'',
    user_info: {},
    notifylist: [],
    hasMessage:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.getStorage({
      key: 'userInfo',
      success: (res) => {
        this.setData({
          "user_info": res.data
          // 'user_info.credit_score': getApp().globalData.userInfo.credit_score
        });
        // userFuc.getMessage(this)
      },
      fail: function(res) {
        console.log(res)
      }
    })
  },
onShow:function(){
  userFuc.getMessage(this)
},
onPullDownRefresh:function(){
  userFuc.getMessage(this)
},
  jumptoparticipation: function() {
    wx.navigateTo({
      url: '/pages/my_participation/my_participation'
    })
  },
  jumptocollection: function() {
    wx.navigateTo({
      url: '/pages/my_collection/my_collection'
    })
  },
  jumptomyreleasetask: function() {
    wx.navigateTo({
      url: '/pages/my_releasetask/my_releasetask'
    })
  },
  navPage: function(e) {
    var page = e.currentTarget.dataset.page
    if (page =='my_info'){
      wx.navigateTo({
        url: '../' + page + '/' + page + '?notifylist=' + JSON.stringify(this.data.notifylist),
      })
    } 
    else{
      wx.navigateTo({
        url: '../' + page + '/' + page,
      })
    }
  }
})