// pages/my_collection/my_participation.js
var taskFuc=require('../../libs/js/task.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasMore: true,
    scrollTop: 0,
    scrollHeight: 0,
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '获取数据中',
    })
    taskFuc.getDeliverTask(this)
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          scrollHeight: res.windowHeight
        })
      }
    })
   
  },
  scrollToTop: function () {
    this.setData({
      scrollTop: 0
    })
  },
  longPress: function (e) {
    console.log(e.currentTarget.dataset.item)
    wx.showModal({ //使用模态框提示用户进行操作
      title: '提示',
      content: '是否取消投标该任务',
      success: (res) => {
        if (res.confirm) { //判断用户是否点击了确定
          taskFuc.deleteDeliverTask(this, this.data.list[e.currentTarget.dataset.index].task_id,e)
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  to_task_detail: function (e) {
    if (e.currentTarget.dataset.item.status == "已结束") {
      wx.showModal({ //使用模态框提示用户进行操作
        title: '提示',
        content: '该任务已结束',
        success: (res) => {
          if (res.confirm) { //判断用户是否点击了确定
          }
        }
      })
    } else {
      wx.navigateTo({
        url: '../task_detail/task_detail?task_id=' + this.data.list[e.currentTarget.dataset.index].task_id,
      })
    }
  }
})