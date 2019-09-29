var publicFuc = require('../../libs/js/public.js')

function getRecommendTask(that, flag) {
  publicFuc.checkLogin
  wx.request({
    url: getApp().globalData.host + 'getRecommendTask',
    dataType: 'json',
    method: 'POST',
    data: {
      'city_id': getApp().globalData.city.cityId,
      'page': that.data.page
    },
    success: function(res) {
      wx.stopPullDownRefresh()
      wx.hideLoading()
      if (res.data.code == 0) {
        if (res.data.data.length == 0) {
          wx.showToast({
            title: '没有数据啦',
            icon: 'none'
          })
          that.setData({
            page: 0,
            hasMore: false,
            canLoadMore: false
          })
        } else {
          if (flag == 'loadMore') {
            that.setData({
              page: that.data.page + 1
            })
            that.setData({
              'recommendTask': that.data.recommendTask.concat(res.data.data)
            })
          } else {
            that.setData({
              page: 0
            })
            that.setData({
              'recommendTask': res.data.data
            })
          }
        }
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    },
    fail: function() {
      wx.showToast({
        title: '连接服务器失败',
        icon: 'none'
      })
    }
  })
}

function getSkillList() {
  wx.request({
    url: getApp().globalData.host + 'getSkillList',
    dataType: 'json',
    method: 'POST',
    data: {},
    success: function(res) {
      if (res.data.code == 0) {
        getApp().globalData.skillList = [{
          'id': -1,
          'name': '不限'
        }].concat(res.data.data)
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: ''
        })
      }
    },
    fail: function() {
      wx.showToast({
        title: '获取数据失败',
        icon: 'none'
      })
    }
  })
}

function getLanguageList(that) {
  wx.request({
    url: getApp().globalData.host + 'getLanguageList',
    dataType: 'json',
    method: 'POST',
    data: {},
    success: function(res) {
      if (res.data.code == 0) {
        getApp().globalData.languageList = res.data.data
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: ''
        })
      }
    },
    fail: function() {
      wx.showToast({
        title: '获取数据失败',
        icon: 'none'
      })
    }
  })
}

function getTaskList(that, flag) {
  publicFuc.checkLogin
  wx.request({
    url: getApp().globalData.host + 'getTaskList',
    dataType: 'json',
    method: 'POST',
    data: {
      user_id: getApp().globalData.openId,
      city_id: that.data.city.cityId,
      sort: that.data.sort
    },
    success: function(res) {
      wx.hideLoading()
      wx.stopPullDownRefresh()
      if (res.data.code == 0) {
        if (res.data.data.length == 0) {
          wx.showToast({
            title: '没有数据啦',
            icon: 'none'
          })
          that.setData({
            hasMore: false,
            "sort.page": 0,
          })
        } else {
          if (flag == 'loadMore') {
            that.setData({
              "sort.page": that.data.sort.page + 1,
              task_list: that.data.task_list.concat(res.data.data)
            })
          } else {
            that.setData({
              "sort.page": 0
            })
            that.setData({
              task_list: res.data.data
            })
          }
        }
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    },
    fail: function() {
      wx.hideLoading()
      wx.stopPullDownRefresh()
      wx.showToast({
        title: '获取数据失败',
        icon: 'none'
      })
      that.setData({
        "sort.page": that.data.sort.page - 1
      })
    }
  })
}

function getTaskDetail(that, task_id) {
  publicFuc.checkLogin
  wx.request({
    url: getApp().globalData.host + 'getTaskDetail',
    dataType: 'json',
    method: 'POST',
    data: {
      task_id: task_id,
      user_id: getApp().globalData.openId
    },
    success: function(res) {
      console.log(res)
      wx.hideLoading()
      if (res.data.code == 0) {
        that.setData({
          taskDetail: res.data.data
        })
        wx.setNavigationBarTitle({
          title: res.data.data.task_title,
        })
        if (res.data.data.status > 1) {
          that.setData({
            canDeliver: false,
            'taskDetail.deliver_info': []
          })
          wx.showToast({
            title: '已不能选标啦',
          })
        }
        if (res.data.data.is_collected.length == 1) {
          that.setData({
            'collect.imgSrc': '../../image/collection_selected.png',
            'collect.text': '已收藏',
            'collect.textColor': '#F2CB51'
          })
        }
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    },
    fail: function(res) {
      wx.showToast({
        title: '连接服务器失败',
        icon: 'none'
      })
    }

  })
}

function collectTask(that) {
  publicFuc.checkLogin
  if (that.data.collect.text == '已收藏') {
    that.setData({
      'collect.imgSrc': '../../image/collection.png',
      'collect.text': '收藏',
      'collect.textColor': '#666'
    })
    wx.request({
      url: getApp().globalData.host + 'collectTask',
      dataType: 'json',
      method: 'POST',
      data: {
        flag: 0,
        task_id: that.data.taskDetail.task_id,
        user_id: getApp().globalData.openId
      },
      success: function(res) {
        if (res.data.code == 0) {
          wx.showToast({
            title: res.data.data,
          })
        } else if (res.statusCode != 200) {
          wx.showToast({
            title: '取消收藏失败',
            icon: 'none'
          })
          that.setData({
            'collect.imgSrc': '../../image/collection_selected.png',
            'collect.text': '已收藏',
            'collect.textColor': '#F2CB51'
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
          that.setData({
            'collect.imgSrc': '../../image/collection_selected.png',
            'collect.text': '已收藏',
            'collect.textColor': '#F2CB51'
          })
        }
      },
      fail: function() {
        wx.showToast({
          title: '连接服务器失败',
          icon: 'none'
        })
        that.setData({
          'collect.imgSrc': '../../image/collection_selected.png',
          'collect.text': '已收藏',
          'collect.textColor': '#F2CB51'
        })
      }
    })
  } else {
    that.setData({
      'collect.imgSrc': '../../image/collection_selected.png',
      'collect.text': '已收藏',
      'collect.textColor': '#F2CB51'
    })
    wx.request({
      url: getApp().globalData.host + 'collectTask',
      dataType: 'json',
      method: 'POST',
      data: {
        flag: 1,
        task_id: that.data.taskDetail.task_id,
        user_id: getApp().globalData.openId
      },
      success: function(res) {
        if (res.data.code == 0) {
          wx.showToast({
            title: res.data.data,
          })
        } else if (res.statusCode != 200) {
          wx.showToast({
            title: '收藏失败',
            icon: 'none'
          })
          that.setData({
            'collect.imgSrc': '../../image/collection.png',
            'collect.text': '收藏',
            'collect.textColor': '#666'
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
          that.setData({
            'collect.imgSrc': '../../image/collection.png',
            'collect.text': '收藏',
            'collect.textColor': '#666'
          })
        }
      },
      fail: function() {
        wx.showToast({
          title: '连接服务器失败',
          icon: 'none'
        })
        that.setData({
          'collect.imgSrc': '../../image/collection.png',
          'collect.text': '收藏',
          'collect.textColor': '#666'
        })
      }
    })
  }
}

function deliverTask(that) {
  var pages = getCurrentPages();
  var prevPage = pages[pages.length - 2];
  wx.request({
    url: getApp().globalData.host + 'deliverTask',
    dataType: 'json',
    method: 'POST',
    data: {
      task_user_id: that.data.task_user_id,
      deliver_info: that.data.deliver_info
    },
    success: function(res) {
      if (res.data.code == 0) {
        wx.showToast({
          title: res.data.data,
          icon: 'none'
        })
        var deliver_info = []
        deliver_info[0] = that.data.deliver_info
        var post_num = prevPage.data.taskDetail.post_num
        if (prevPage.data.taskDetail.deliver_info.length == 0) {
          post_num++
        }
        prevPage.setData({
          'taskDetail.deliver_info': deliver_info,
          'taskDetail.post_num': post_num,
          'taskDetail.deliver_info[0].city_name': that.data.city.cityName,
          'taskDetail.deliver_info[0].city_id': that.data.city.cityId
        })
        setTimeout(function() {
          wx.navigateBack({})
        }, 1000)
      } else {
        wx.showToast({
          title: '提交失败，请稍后重试',
          icon: 'none'
        })
      }
    }
  })
}

function releaseTask(that) {
  wx.request({
    url: getApp().globalData.host + 'releaseTask',
    dataType: 'json',
    method: 'POST',
    data: {
      task_info: that.data.task_info
    },
    success: function(res) {
      console.log(res)
      if (res.data.code == 0) {
        wx.showToast({
          title: res.data.data,
          icon: 'none'
        })
        that.setData({
          task_title: '',
          realvalue: '',
          task_money: '',
          developtext: '',
          lantext: '',
          city: {
            cityId: 0,
            cityName: '不限'
          }
        })
      } else {
        wx.showToast({
          title: '发布失败，请稍后重试',
          icon: 'none'
        })
      }
    }
  })
}

function getResumeList(that, flag) {
  publicFuc.checkLogin
  wx.request({
    url: getApp().globalData.host + 'getTaskList',
    dataType: 'json',
    method: 'POST',
    data: {
      user_id: getApp().globalData.openId,
      city_id: that.data.city.cityId,
      sort: that.data.sort
    },
    success: function(res) {
      wx.hideLoading()
      wx.stopPullDownRefresh()
      if (res.data.code == 0) {
        if (res.data.data.length == 0) {
          wx.showToast({
            title: '没有数据啦',
            icon: 'none'
          })
          that.setData({
            hasMore: false,
            "sort.page": 0,
          })
        } else {
          if (flag == 'loadMore') {
            that.setData({
              "sort.page": that.data.sort.page + 1,
              task_list: that.data.task_list.concat(res.data.data)
            })
          } else {
            that.setData({
              "sort.page": 0
            })
            that.setData({
              task_list: res.data.data
            })
          }
        }
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    },
    fail: function() {
      wx.hideLoading()
      wx.stopPullDownRefresh()
      wx.showToast({
        title: '获取数据失败',
        icon: 'none'
      })
      that.setData({
        "sort.page": that.data.sort.page - 1
      })
    }
  })
}

function getResumeList(that, flag) {
  publicFuc.checkLogin
  wx.request({
    url: getApp().globalData.host + 'getResumeList',
    dataType: 'json',
    method: 'POST',
    data: {
      user_id: getApp().globalData.openId,
      city_id: that.data.city.cityId,
      sort: that.data.sort
    },
    success: function(res) {
      console.log(res)
      wx.hideLoading()
      wx.stopPullDownRefresh()
      if (res.data.code == 0) {
        if (res.data.data.length == 0) {
          wx.showToast({
            title: '没有数据啦',
            icon: 'none'
          })
          that.setData({
            hasMore: false,
            "sort.page": 0,
          })
        } else {
          if (flag == 'loadMore') {
            that.setData({
              "sort.page": that.data.sort.page + 1,
              resume_list: that.data.resume_list.concat(res.data.data)
            })
          } else {
            that.setData({
              "sort.page": 0
            })
            that.setData({
              resume_list: res.data.data
            })
          }
        }
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    },
    fail: function() {
      wx.hideLoading()
      wx.stopPullDownRefresh()
      wx.showToast({
        title: '获取数据失败',
        icon: 'none'
      })
      that.setData({
        "sort.page": that.data.sort.page - 1
      })
    }
  })
}

function hire(that) {
  if (that.data.hire_info == '') {
    wx.showToast({
      title: '填一点东西吧，不然人才不知道您雇佣他想干啥哦',
      icon: 'none'
    })
  } else if (that.data.wechat_num == '') {
    wx.showToast({
      title: '请留下您的微信号哦，方便人才联系您',
      icon: 'none'
    })
  } else {
    wx.request({
      url: getApp().globalData.host + 'hire',
      dataType: 'json',
      method: 'POST',
      data: {
        user_id: getApp().globalData.openId,
        hire_user_id: that.data.hire_user_id,
        hire_info: that.data.hire_info,
        wechat_num: that.data.wechat_num,
      },
      success: function(res) {
        if (res.statusCode == 200) {
          if (res.data.code == 0) {
            wx.showToast({
              title: res.data.data,
              icon: 'none'
            })
            setTimeout(function() {
              wx.navigateBack({})
            }, 1000)
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
          }
        } else {
          wx.showToast({
            title: '连接服务器失败',
            icon: 'none'
          })
        }
      },
      fail: function() {
        wx.showToast({
          title: '连接服务器失败',
          icon: 'none'
        })
      }
    })
  }
}
function getMyTask(that){
  wx.request({
    url: getApp().globalData.host + 'getMyTask',
    dataType: 'json',
    method: 'POST',
    data: {
      user_id: getApp().globalData.openId,
    },
    success: function (res) {
      console.log(res)
      wx.hideLoading()
      if(res.statusCode==200){
        if(res.data.code==0){
          that.setData({
            list:res.data.data
          })
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }else{
        wx.showToast({
          title: '连接服务器失败',
          icon: 'none'
        })
      }
    },fail:function(){
      wx.showToast({
        title: '连接服务器失败',
        icon: 'none'
      })
    }
  })
}
function deleteMyTask(that, task_id,e){
  wx.request({
    url: getApp().globalData.host + 'deleteMyTask',
    dataType: 'json',
    method: 'POST',
    data: {
      user_id: getApp().globalData.openId,
      task_id: task_id
    },
    success: function (res) {
      console.log(res)
      if (res.statusCode == 200) {
        if (res.data.code == 0) {
          that.data.list.splice(e.currentTarget.dataset.index, 1)
          that.setData({
            list: that.data.list
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      } else {
        wx.showToast({
          title: '连接服务器失败',
          icon: 'none'
        })
      }
    }, fail: function () {
      wx.showToast({
        title: '连接服务器失败',
        icon: 'none'
      })
    }
  })
}
function getDeliverTask(that){
  wx.request({
    url: getApp().globalData.host + 'getDeliverTask',
    dataType: 'json',
    method: 'POST',
    data: {
      user_id: getApp().globalData.openId,
    },
    success: function (res) {
      console.log(res)
      wx.hideLoading()
      wx.hideLoading()
      if (res.statusCode == 200) {
        if (res.data.code == 0) {
          that.setData({
            list: res.data.data
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      } else {
        wx.showToast({
          title: '连接服务器失败',
          icon: 'none'
        })
      }
    }, fail: function () {
      wx.showToast({
        title: '连接服务器失败',
        icon: 'none'
      })
    }
  })
}
function deleteDeliverTask(that,task_id,e){
  wx.request({
    url: getApp().globalData.host + 'deleteDeliverTask',
    dataType: 'json',
    method: 'POST',
    data: {
      user_id: getApp().globalData.openId,
      task_id: task_id
    },
    success: function (res) {
      if (res.statusCode == 200) {
        if (res.data.code == 0) {
          that.data.list.splice(e.currentTarget.dataset.index, 1)
          that.setData({
            list: that.data.list
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      } else {
        wx.showToast({
          title: '连接服务器失败',
          icon: 'none'
        })
      }
    }, fail: function () {
      wx.showToast({
        title: '连接服务器失败',
        icon: 'none'
      })
    }
  })
}
function getRecommendList(that){
  wx.request({
    url: getApp().globalData.host + 'getRecommendList',
    dataType: 'json',
    method: 'POST',
    data:{
      city_id:getApp().globalData.city.cityId
    },
    success: function (res) {
      if (res.statusCode == 200) {
        if (res.data.code == 0) {
          that.setData({
            recommendList: res.data.data
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      } else {
        wx.showToast({
          title: '连接服务器失败',
          icon: 'none'
        })
      }
    }, fail: function () {
      wx.showToast({
        title: '连接服务器失败',
        icon: 'none'
      })
    }
  })
}
module.exports = {
  getRecommendTask,
  getSkillList,
  getTaskDetail,
  getLanguageList,
  getTaskList,
  collectTask,
  deliverTask,
  releaseTask,
  getResumeList,
  hire,
  getMyTask,
  deleteMyTask,
  getDeliverTask,
  deleteDeliverTask,
  getRecommendList
}