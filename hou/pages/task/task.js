var publicFuc = require('../../libs/js/public.js')
var taskFunc = require('../../libs/js/task.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recommendList:[],
    city: {
      cityId: 0,
      cityName: '不限',
    },
    banners: [{
        'info_url': 'https://www.baidu.com',
        'img_url': 'https://crowdsource-1254170634.cos.ap-chengdu.myqcloud.com/banner/0.png'
      },
      {
        'info_url': 'https://www.iconfont.cn',
        'img_url': 'https://crowdsource-1254170634.cos.ap-chengdu.myqcloud.com/banner/1.png'
      },
      {
        'info_url': 'https://www.yuanjisong.com',
        'img_url': 'https://crowdsource-1254170634.cos.ap-chengdu.myqcloud.com/banner/2.png'
      },
      {
        'info_url': 'https://fanyi.baidu.com/translate',
        'img_url': 'https://crowdsource-1254170634.cos.ap-chengdu.myqcloud.com/banner/3.png'
      }
    ],
    citys: [],
    recommendTask: [],
    scrollTop: 0,
    page: 0,
    canLoadMore: true,
    hasMore: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      'city': getApp().globalData.city
    })
    //初始化程序
    publicFuc.getCityList(this)
    wx.showLoading({
      title: '获取数据中',
    })
    taskFunc.getRecommendTask(this)
    taskFunc.getRecommendList(this)
  },
  onShow: function(options) {
    taskFunc.getRecommendList(this)
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.setData({
      page:0,
      recommendTask:[],
      canLoadMore:true,
      hasMore:true,
    })
    wx.showLoading({
      title: '获取数据中',
    })
    taskFunc.getRecommendTask(this, 'loadMore')
  },
  chooseCity: function() {
      wx.navigateTo({
        url: '../choose_city/choose_city?fromPage=task'
      })
  },
  toSearch: function() {
      wx.navigateTo({
        url: '../search/search?recommendTask=' + JSON.stringify(this.data.recommendList),
      })
  },
  scrollToTop: function() {
    taskFunc.getRecommendTask(this)
    this.setData({
      scrollTop: 0
    })
  },
  toTaskDetail: function(e) {
      wx.navigateTo({
        url: '../task_detail/task_detail?task_id=' + e.currentTarget.dataset.taskid,
      })
  },
  toWebPage: function(e) {
      // wx.navigateTo({
      //   url: '../web_page/web_page?info_url=' + e.currentTarget.dataset.url,
      // })
  },
  loadMore: function(e) {
    if (this.data.canLoadMore) {
      wx.showLoading({
        title: '获取数据中',
      })
      taskFunc.getRecommendTask(this, 'loadMore')
    }
  },
  setCanLoadMore: function(e) {
    if (e.detail.deltaY < 0 && this.data.hasMore) {
      this.setData({
        canLoadMore: true
      })
    } else {
      this.setData({
        canLoadMore: false
      })
    }
  },
  share: function(e) {

  },
})