// pages/choose_city/choose_city.js
var publicFuc = require('../../libs/js/public.js')
var taskFunc = require('../../libs/js/task.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fromPage: null,
    keyword: null,
    hot: [{
        'cityId': 1,
        'cityName': '北京'
      },
      {
        'cityId': 102,
        'cityName': '成都'
      },
      {
        'cityId': 2,
        'cityName': '上海'
      },
      {
        'cityId': 3,
        'cityName': '广州'
      },
      {
        'cityId': 4,
        'cityName': '深圳'
      },
    ],
    citys: {},
    keyword: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      'citys': getApp().globalData.cityList,
      fromPage: options.fromPage
    })
  },
  search: function(e) {
    this.setData({
      keyword: e.detail.value
    })
    publicFuc.searchCity(e.detail.value, this)
  },
  cancel: function() {
    this.setData({
      keyword: null,
      citys: getApp().globalData.cityList
    })
  },
  setCity: function(e) {
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    if (this.data.fromPage == 'task') {
      getApp().globalData.city = e.target.dataset.city
      prevPage.setData({
        city: e.target.dataset.city,
        page: 0,
        recommendTask: [],
        canLoadMore: true,
        hasMore: true
      });
      taskFunc.getRecommendTask(prevPage, 'loadMore')
    } else if (this.data.fromPage == 'release_task' || this.data.fromPage == 'deliver_task') {
      prevPage.setData({
        city: e.target.dataset.city
      });
    } else if (this.data.fromPage == 'my_skill') {
      prevPage.setData({
        'user_resume_info.city.city_id': e.target.dataset.city.cityId,
        'user_resume_info.city.city_name': e.target.dataset.city.cityName
      });
    } else if (this.data.fromPage == 'task_list') {
      prevPage.setData({
        hasMore: true,
        canLoadMore: true,
        city: e.target.dataset.city
      });
      taskFunc.getTaskList(prevPage)
    }
    else if (this.data.fromPage == 'resume_list'){
      prevPage.setData({
        hasMore: true,
        canLoadMore: true,
        city: e.target.dataset.city
      });
      taskFunc.getResumeList(prevPage)
    }
    wx.navigateBack({})
  }
})