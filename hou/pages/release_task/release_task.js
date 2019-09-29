// pages/release_task/release_task.js
var taskFuc=require('../../libs/js/task.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    task_info:{

    },
    getheight:"",
    release_user_wechat_num:"",
    task_title:"",
    task_money:"",
    skill_id: -1,
    language_id:-1,
    typeitems: [],
    languageitems:[],
    date: require('../../libs/js/public.js').getDateTime(),
    coverdisplay:'none',
    typedisplay:'none',
    languagedisplay:'none',
    dp:'block',
    lantext:'',
    developtext:'',
    realvalue:'',
    showvalue:'',
    city:{cityId: 0,cityName: '不限'}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let query = wx.createSelectorQuery();
    query.select('.page').boundingClientRect(rect => {
      let clientHeight = rect.height;
      let clientWidth = rect.width;
      let ratio = 750 / clientWidth;
      var height = clientHeight * ratio;
      this.setData({
        typeitems: getApp().globalData.skillList,
        languageitems: getApp().globalData.languageList,
        getheight: height + 'rpx'
      })
    }).exec();
    
  },
  getContactWechatNum:function(e){
    this.setData({
      release_user_wechat_num: e.detail.value
    })
  },
  getTaskmoney: function (e) {
    this.setData({
      task_money: e.detail.value
    })
  },
  getTasktitle:function(e){
    this.setData({
      task_title:e.detail.value
    })
  },
  hidecover:function(){
    this.setData({
      dp:true,
      showvalue:'',
      coverdisplay: 'none',
      typedisplay: 'none',
      languagedisplay: 'none'
    })
  },
  jumpcitychoose:function(){
    wx.navigateTo({
      url: '../choose_city/choose_city?fromPage=release_task'
    })
  },
  bindDateChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  inputs:function(e){
    this.setData({
      realvalue: e.detail.value
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
  showdeveloptype:function(){
    this.setData({
      coverdisplay: 'block',
      typedisplay:'block',
      dp:'none',
      showvalue: this.data.realvalue
    })
  },
  getradiovalue:function(e){
    let infoarr=e.detail.value.split('||')
    let value = infoarr[0]
    let id=infoarr[1]
    this.setData({
      coverdisplay: 'none',
      typedisplay: 'none',
      dp: 'block',
      showvalue:'',
      language_id: id,
      developtext: value
    })
  },
  showdeveloplanguage: function (e) {
    this.setData({
      coverdisplay: 'block',
      languagedisplay: 'block',
      dp: 'none',
      showvalue: this.data.realvalue,
      
    })
  },
  getradiolan: function (e) {
    let infoarr = e.detail.value.split('||')
    let value = infoarr[0]
    let id = infoarr[1]
    this.setData({
      coverdisplay: 'none',
      languagedisplay: 'none',
      dp: 'block',
      showvalue: '',
      skill_id: id,
      lantext: value
    })
  },
  sendinfo:function(){
    /*
    task_info
    task_title:this.data.task_title
    task_description:this.data.realvalue
    task_price:this.data.task_money
    skill_id:this.data.skill_id
    language_id:this.data.language_id
    city_id:this.data.city.cityId
    end_time:this.data.date
    release_user_wechat_num:this.data.release_user_wechat_num
    user_id:getApp().globalData.openId
    */
    if (this.data.task_title==null ||this.data.task_title == ""){
      wx.showToast({
        title: '请填入标题',
        icon: 'none',
        duration: 2000
      })
    } else if (this.data.realvalue == null || this.data.realvalue==""){
      wx.showToast({
        title: '请填入详细描述',
        icon: 'none',
        duration: 2000
      })
    } else if (isNaN(this.data.task_money) || this.data.task_money.toString()[0]=="."){
      wx.showToast({
        title: '预算金额非法填入',
        icon: 'none',
        duration: 2000
      })
    } else if (this.data.task_money == null || this.data.task_money==""){
      wx.showToast({
        title: '请填入预算金额',
        icon: 'none',
        duration: 2000
      })
    } else if (this.data.language_id==-1){
      wx.showToast({
        title: '请选择开发类型',
        icon: 'none',
        duration: 2000
      })
    } else if(this.data.skill_id==-1){
      wx.showToast({
        title: '请选择开发语言',
        icon: 'none',
        duration: 2000
      })
    }else{
      this.setData({
        task_info: {
          task_title: this.data.task_title,
          task_description: this.data.realvalue,
          task_price: this.data.task_money,
          skill_id: this.data.skill_id,
          language_id: this.data.language_id,
          city_id: this.data.city.cityId,
          end_time: this.data.date,
          release_user_wechat_num: this.data.release_user_wechat_num,
          user_id: getApp().globalData.openId
        }
      })
      require('../../libs/js/task').releaseTask(this)
    }
  }
})