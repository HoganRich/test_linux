// pages/task_detail/task_detail.js
var taskFunc = require('../../libs/js/task.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canDeliver:true,
    data: [{
      'id': 1,
      'name': 'IOS开发',
    }, {
      'id': 2,
      'name': 'Android开发',
    }, {
      'id': 3,
      'name': '软件开发',
    }, {
      'id': 4,
      'name': 'Web开发',
    }, {
      'id': 5,
      'name': '微信小程序',
    }, {
      'id': 6,
      'name': '公众号开发',
    }, {
      'id': 7,
      'name': '脚本开发',
    }, {
      'id': 8,
      'name': '数据分析',
    }, {
      'id': 9,
      'name': '数据采集',
    }, {
      'id': 10,
      'name': '程序二开',
    }, {
      'id': 11,
      'name': '其它',
    }],
    taskDetail: {},
    collect: {
      imgSrc: '../../image/collection.png',
      text: '收藏',
      textColor: '#666'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '获取数据中',
    })
    taskFunc.getTaskDetail(this, options.task_id)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

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
  onShareAppMessage: function(res) {
    console.log(res)
    return {
      title: this.data.taskDetail.task_title,
      path: 'pages/task_detail/task_detail?task_id=' + this.data.taskDetail.task_id,
    }
  },
  setId: function(e) {
    console.log(e)
  },
  collect: function() {
    taskFunc.collectTask(this)
  },
  deliver_task: function() {
    if (this.data.canDeliver) {
      wx.navigateTo({
        url: '../deliver_task/deliver_task?task_id=' + this.data.taskDetail.task_id + '&task_price=' + this.data.taskDetail.task_price + '&deliver_info=' + JSON.stringify(this.data.taskDetail.deliver_info)+'&task_user_id='+this.data.taskDetail.user_id,
      })
    }
  }
})