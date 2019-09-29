// pages/task_list/task_list.js
var taskFunc = require('../../libs/js/task.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyword: '',
    city: {
      cityId: 0,
      cityName: '不限',
    },
    index: -1,
    typeitems: [],
    languageitems: [],
    sort: {
      'page': 0,
      'skill_id': -1,
      'language_id': 0,
      'sort_id': 0,
      'keyword': '',
    },
    sortitems: [{
      id: 0,
      name: '默认排序'
    }, {
      id: 1,
      name: '最新发布'
    }, {
      id: 2,
      name: '总价降序'
    }, {
      id: 3,
      name: '总价升序'
    }, {
      id: 4,
      name: '投标人数降序'
    }],
    screen_arg: [{
        id: 0,
        text: '开发类型',
        textClass: 'screen-text',
        imgSrc: '../../image/more.png'
      },
      {
        id: 1,
        text: '开发语言',
        textClass: 'screen-text',
        imgSrc: '../../image/more.png'
      },
      {
        id: 2,
        text: '默认排序',
        textClass: 'screen-text',
        imgSrc: '../../image/more.png'
      }
    ],
    task_list: [],
    scrollTop: 0,
    canLoadMore: true,
    hasMore: true,
    windowHeight: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    this.setData({
      typeitems: getApp().globalData.skillList,
      languageitems: getApp().globalData.languageList
    })
    wx.getSystemInfo({       
      success: function(res) {        
        let clientHeight = res.windowHeight,
                  clientWidth = res.windowWidth,
                  rpxR = 750 / clientWidth;        
        var calc = clientHeight * rpxR;        
        console.log(calc)        
        that.setData({            
          windowHeight: calc - 10        
        });       
      }    
    });
    this.setData({
      'city': getApp().globalData.city,
      'sort.keyword': options.keyword
    })
    wx.setNavigationBarTitle({
      title: options.keyword,
    })
    wx.showLoading({
      title: '获取数据中',
    })
    taskFunc.getTaskList(this, 'loadMore')
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
    console.log(this.data.city)
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
  onPullDownRefresh: function() {},

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
  chooseCity: function() {
    wx.navigateTo({
      url: '../choose_city/choose_city?fromPage=task_list'
    })
  },
  setSearch: function(e) {
    console.log(e.detail.value)
    this.setData({
      'sort.keyword': e.detail.value
    })
  },
  search: function(e) {
    console.log(e)
    wx.showLoading({
      title: '搜索中',
    })
    this.setData({
      'sort.keyword': e.detail.value
    })
    wx.setNavigationBarTitle({
      title: e.detail.value
    })
    taskFunc.getTaskList(this)
  },
  cancel: function() {
    this.setData({
      keyword: ''
    })
  },
  setScreen: function(e) {
    if (this.data.index != -1 && this.data.index == e.currentTarget.dataset.id) {
      this.setData({
        index: -1
      })
    } else {
      this.setData({
        index: e.currentTarget.dataset.id
      })
    }
    if (this.data.screen_arg[e.currentTarget.dataset.id].textClass == 'screen-text-selected') {
      var text = "screen_arg[" + e.currentTarget.dataset.id + "].textClass"
      var img = "screen_arg[" + e.currentTarget.dataset.id + "].imgSrc"
      this.setData({
        [text]: 'screen-text',
        [img]: '../../image/more.png'
      })
    } else {
      for (var i = 0; i < 3; i++) {
        if (i != e.currentTarget.dataset.id) {
          var text = "screen_arg[" + i + "].textClass"
          var img = "screen_arg[" + i + "].imgSrc"
          this.setData({
            [text]: 'screen-text',
            [img]: '../../image/more.png'
          })
        } else {
          var text = "screen_arg[" + e.currentTarget.dataset.id + "].textClass"
          var img = "screen_arg[" + e.currentTarget.dataset.id + "].imgSrc"
          this.setData({
            [text]: 'screen-text-selected',
            [img]: '../../image/more_selected.png'
          })
        }
      }
    }
  },
  setSkill: function(e) {
    this.setData({
      index: -1,
      'sort.page': 0,
      'sort.skill_id': e.currentTarget.dataset.id,
      'screen_arg[0].textClass': 'screen-text',
      'screen_arg[0].imgSrc': '../../image/more.png',
      'screen_arg[0].text': e.currentTarget.dataset.name,
      task_list: [],
      hasMore: true
    })
    if (e.currentTarget.dataset.id == -1) {
      this.setData({
        'screen_arg[0].text': '开发类型',
      })
    }
    wx.showLoading({
      title: '获取数据中',
    })
    taskFunc.getTaskList(this, 'loadMore')
  },
  setLanguage: function(e) {
    this.setData({
      index: -1,
      'sort.page': 0,
      'sort.language_id': e.currentTarget.dataset.id,
      'screen_arg[1].textClass': 'screen-text',
      'screen_arg[1].imgSrc': '../../image/more.png',
      'screen_arg[1].text': e.currentTarget.dataset.name,
      task_list: [],
      hasMore: true
    })
    if (e.currentTarget.dataset.id == 0) {
      this.setData({
        'screen_arg[1].text': '开发语言',
      })
    }
    wx.showLoading({
      title: '获取数据中',
    })
    taskFunc.getTaskList(this, 'loadMore')
  },
  setSort: function(e) {
    this.setData({
      index: -1,
      'sort.page': 0,
      'sort.sort_id': e.currentTarget.dataset.id,
      'screen_arg[2].textClass': 'screen-text',
      'screen_arg[2].imgSrc': '../../image/more.png',
      'screen_arg[2].text': e.currentTarget.dataset.name,
      task_list: [],
      hasMore: true
    })
    wx.showLoading({
      title: '获取数据中',
    })
    taskFunc.getTaskList(this, 'loadMore')
  },
  loadMore: function() {
    if (this.data.canLoadMore) {

      wx.showLoading({
        title: '获取数据中',
      })
      taskFunc.getTaskList(this, 'loadMore')
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
  scrollToTop: function() {
    this.setData({
      scrollTop: 0
    })
  },
  toTaskDetail: function(e) {
    wx.navigateTo({
      url: '../task_detail/task_detail?task_id=' + e.currentTarget.dataset.taskid,
    })
  },
  share: function(e) {

  },
  collect: function(e) {

  }
})