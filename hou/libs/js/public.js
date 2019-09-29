var taskFuc = require('../../libs/js/task.js')

function getCityList() {
  wx.request({
    url: getApp().globalData.host + 'getCityList',
    dataType: 'json',
    method: 'POST',
    success: function(res) {
      if (res.data.code == 0) {
        getApp().globalData.cityList = res.data.data
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    },
    fail: function() {
      wx.showToast({
        title: '获取城市信息失败',
        icon: 'none'
      })
    }
  })
}

function searchCity(keyword, that) {
  wx.request({
    url: getApp().globalData.host + 'searchCity',
    dataType: 'json',
    method: 'POST',
    data: {
      keyword: keyword
    },
    success: function(res) {
      if (res.data.code == 0) {
        that.setData({
          'citys': res.data.data
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    },
    fail: function() {
      wx.showToast({
        title: '查询失败',
        icon: 'none'
      })
    }
  })
}

function getCity(that) {
  wx.getLocation({
    success: function(res) {
      wx.request({
        url: getApp().globalData.host + 'getCity',
        dataType: 'json',
        method: 'POST',
        data: {
          latitude: res.latitude,
          longitude: res.longitude
        },
        success: function(res) {
          console.log(res)
          wx.hideLoading()
          if (res.data.code == 0) {
            wx.showModal({
              title: '提示',
              content: '您当前所在的城市是' + res.data.data.city_name + '市，是否切换？',
              success: function(flag) {
                if (flag.confirm) {
                  getApp().globalData.city.cityId = res.data.data.city_id
                  getApp().globalData.city.cityName = res.data.data.city_name
                  // const pages = getCurrentPages()
                  // const perpage = pages[pages.length - 1]
                  // perpage.onLoad()
                  // taskFuc.getRecommendTask(that)
                }
                  wx.switchTab({
                    url: '../task/task',
                  })
              }
            })
          } else {
            wx.showToast({
              title: '定位失败,请检查GPS是否打开，稍后重试',
              icon: 'none'
            })
          }
        },
        fail: function() {
          // that.setData({
          //   canOp: true,
          //   'scrollTop': 0
          // })
          wx.showToast({
            title: '定位失败',
            icon: 'none'
          })
        }
      })
    },
    fail: function(res) {
      wx.showToast({
        title: '请打开GPS或稍后重试',
        icon: 'none'
      })
    }
  })
}

function getDateTime() {
  var date = new Date();
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [year, month, day].map(formatNumber).join('-')
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function checkLogin() {
  if (getApp().userInfo == null) {
    wx.showToast({
      title: '请登录',
    })
    wx.switchTab({
      url: "pages/index/index",
    })
  }
}


module.exports = {
  getCityList: getCityList,
  searchCity: searchCity,
  getCity: getCity,
  getDateTime: getDateTime,
  checkLogin: checkLogin
}