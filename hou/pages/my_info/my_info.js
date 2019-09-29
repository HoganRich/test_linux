// pages/my_info/my_info.js
var userFuc = require('../../libs/js/user.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollTop: 0,
    scrollHeight: 0,
    term: [],
    flag: [],
    notifylist: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      notifylist: JSON.parse(options.notifylist)
    })
    this.data.notifylist.forEach((item, index) => {
      this.data.term.push(item.notifyinfo)
      if (item.ischeck == 0) {
        this.data.flag.push(true)
        this.setData({
          term: this.data.term,
          flag: this.data.flag,
          ["notifylist[" + index + "].notifyinfo"]: item.notifyinfo.substring(0, Math.ceil(item.notifyinfo.length * 0.5)) + '...'
        })
      } else {
        this.data.flag.push(true)
        this.setData({
          term: this.data.term,
          flag: this.data.flag,
          ["notifylist[" + index + "].notifyinfo"]: item.notifyinfo.substring(0, Math.ceil(item.notifyinfo.length * 0.5)) + '...'
        })
      }

    })
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          scrollHeight: res.windowHeight
        })
      }
    })
  },
  scrollToTop: function() {
    this.setData({
      scrollTop: 0
    })
  },
  longPress: function(e) {
    if (this.data.flag[e.currentTarget.dataset.index] == true){
      wx.showModal({ //使用模态框提示用户进行操作
        title: '提示',
        content: '请问您是否需要删除这条消息吗',
        success: (res) => {
          if (res.confirm) { //判断用户是否点击了确定
            userFuc.deleteMessage(this, this.data.notifylist[e.currentTarget.dataset.index].id, e)
          }
        }
      })
    }
  },
  getmoreinfo: function(e) {
    if (this.data.flag[e.currentTarget.dataset.index]) {
      if (this.data.notifylist[e.currentTarget.dataset.index].ischeck == 0) {
        userFuc.checkMessage(this.data.notifylist[e.currentTarget.dataset.index].id)
        // var prevPage = pages[pages.length - 2];
        // prevPage.setData({

        // })
      }
      this.setData({
        ["flag[" + e.currentTarget.dataset.index + "]"]: false,
        ["notifylist[" + e.currentTarget.dataset.index + "].ischeck"]: 1,
        ["notifylist[" + e.currentTarget.dataset.index + "].notifyinfo"]: this.data.term[e.currentTarget.dataset.index]
      })
    } else {
      this.setData({
        ["flag[" + e.currentTarget.dataset.index + "]"]: true,
        // ["notifylist[" + e.currentTarget.dataset.index + "].ischeck"]: 0,
        ["notifylist[" + e.currentTarget.dataset.index + "].notifyinfo"]: this.data.notifylist[e.currentTarget.dataset.index].notifyinfo.substring(0, Math.ceil(this.data.notifylist[e.currentTarget.dataset.index].notifyinfo.length * 0.5)) + '...'
      })
    }
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

  }
})