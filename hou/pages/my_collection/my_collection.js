// pages/my_collection/my_collection.js
var userFuc = require('../../libs/js/user.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollTop:0,
    scrollHeight: 0,
    list: []

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          scrollHeight: res.windowHeight
        })
      }
    })
    userFuc.getMyCollection(this)
   
    
  },
  scrollToTop: function () {
    this.setData({
      scrollTop: 0
    })
  },
  longPress: function(e) {
    wx.showModal({ //使用模态框提示用户进行操作
      title: '提示',
      content: '请问您是否需要删除该条收藏',
      success: (res) => {
        if (res.confirm) { //判断用户是否点击了确定
          this.data.list.splice(e.currentTarget.dataset.index, 1)
          this.setData({
            list:this.data.list
          })
          userFuc.deleteMyCollection(this, (e.currentTarget.dataset.item.task_id))       
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    userFuc.getMyCollection(this)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  to_task_detail: function(e) {
    if (e.currentTarget.dataset.item.status=="已结束"){
      wx.showModal({ //使用模态框提示用户进行操作
        title: '提示',
        content: '该条收藏任务已结束',
        success: (res) => {
          if (res.confirm) { //判断用户是否点击了确定
          }
        }
      })
    }else{
      wx.navigateTo({
        url: '../task_detail/task_detail?task_id=' + this.data.list[e.currentTarget.dataset.index].task_id,
      })
    }
    
  }
})