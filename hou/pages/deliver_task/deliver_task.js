// pages/deliver_task/deliver_task.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deliver_info: {},
    task_user_id:'',
    task_id: null,
    task_price: 0,
    taskvaluetext: "",
    worktimetext: "",
    taskvalue: "",
    worktimevalue: "",
    taskvaluedes: "",
    taskvaluedescrible: "",
    wechat_num:'',
    wordnum: 500,
    city: {
      cityId: 0,
      cityName: '不限'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      task_user_id:options.task_user_id,
      city: getApp().globalData.city,
      task_id: options.task_id,
      task_price: options.task_price,
      taskvaluetext: "雇主预期价￥" + options.task_price,
      worktimetext: "周期1-1000"
    })
    if (JSON.parse(options.deliver_info).length == 1) {
      this.setData({
        deliver_info: JSON.parse(options.deliver_info)[0],
        'city.cityName': JSON.parse(options.deliver_info)[0].city_name,
        'city.cityId': JSON.parse(options.deliver_info)[0].city_id,
        taskvalue: JSON.parse(options.deliver_info)[0].deliver_money,
        worktimevalue: JSON.parse(options.deliver_info)[0].time_spent,
        taskvaluedes: JSON.parse(options.deliver_info)[0].deliver_description,
        wordnum: this.data.wordnum - JSON.parse(options.deliver_info)[0].deliver_description.length,
        wechat_num: JSON.parse(options.deliver_info)[0].wechat_num
      })
    }
  },
  jumpcitychoose: function() {
    wx.navigateTo({
      url: '../choose_city/choose_city?fromPage=deliver_task'
    })
  },
  taskvaluehandler: function(e) {
    this.setData({
      taskvaluetext: "",
      taskvalue: e.detail.value
    })

  },
  worktimehandler: function(e) {
    this.setData({
      worktimetext: "",
      worktimevalue: e.detail.value
    })
  },
  getvaluedescrible: function(e) {
    this.setData({
      wordnum: 500 - e.detail.value.length,
      taskvaluedes: e.detail.value
    })

  },
  sendreq: function() {
    // taskvalue deliver_money
    // worktimevalue time_spent
    // taskvaluedes deliver_description
    // city.cityId city_id
    // task_id
    // user_id
    if (isNaN(this.data.taskvalue) || this.data.taskvalue.toString()[0]==".") {
      wx.showToast({
        title: '任务报价填入非法',
        icon: 'none',
        duration: 2000
      })
    } else if (isNaN(this.data.worktimevalue)) {
      wx.showToast({
        title: '工作周期填入非法',
        icon: 'none',
        duration: 2000
      })
    } else if(this.data.taskvalue==null||this.data.taskvalue==''){
      wx.showToast({
        title: '请输入任务报价',
        icon: 'none',
        duration: 2000
      })
    } else if (this.data.worktimevalue == null || this.data.worktimevalue == '') {
      wx.showToast({
        title: '请输入工作周期',
        icon: 'none',
        duration: 2000
      })
    } else if (this.data.taskvaluedes == null || this.data.taskvaluedes == '') {
      wx.showToast({
        title: '请输入报价说明',
        icon: 'none',
        duration: 2000
      })
    } else if (this.data.wechat_num==''){
      wx.showToast({
        title: '请输入您的微信号，用于雇主联系您',
        icon: 'none',
        duration: 2000
      })
    }
    else {
      // 提交标书
      this.setData({
        deliver_info: {
          deliver_money: this.data.taskvalue,
          time_spent: this.data.worktimevalue,
          deliver_description: this.data.taskvaluedes,
          city_id: this.data.city.cityId,
          task_id: this.data.task_id,
          user_id: getApp().globalData.openId,
          wechat_num:this.data.wechat_num
        }
      })
      require('../../libs/js/task').deliverTask(this)
    }

    // console.log(this.data.taskvalue)
    // console.log(this.data.worktimevalue)
    // console.log(this.data.taskvaluedes)
    // console.log(this.data.city.cityId)
    // console.log(this.data.task_id)
    // console.log(getApp().globalData.openId)

  },
  lostblur: function(e) {
    if (e.detail.value == "") {
      this.setData({
        taskvaluetext: "雇主预期价￥" + this.data.task_price,
        worktimetext: "周期1-1000"
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

  },
  setwechat:function(e){
    this.setData({
      wechat_num:e.detail.value
    })
  }
})