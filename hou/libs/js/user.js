var reg = /^((https|http|ftp|rtsp|mms){0,1}(:\/\/){0,1})www\.(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/i
var taskFunc=require('../js/task.js')
var publicFuc=require('../js/public.js')
function login(that) {
  wx.login({
    success(res) {
      if (res.code) {
        wx.request({
          url: getApp().globalData.host + 'getOpenId',
          method: 'POST',
          dataType: "json",
          header: {
            'Content-Type': 'application/json'
          },
          data: {
            code: res.code
          },
          success: function(res) {
            wx.hideLoading()
            getApp().globalData.openId = res.data.openid
            wx.setStorage({
              key: 'openId',
              data: res.data.openid,
            })
            that.setData({
              showflag:true
            })
          },
          fail: function(res) {
            wx.showToast({
              title: '登录失败',
              icon: 'none'
            })
          }
        })
      } else {
        wx.showToast({
          title: '登录失败',
          icon: 'none'
        })
      }
    }
  })
}

function checkSignup(that) {
  wx.request({
    url: getApp().globalData.host + 'getUserInfo',
    method: 'POST',
    dataType: "json",
    header: {
      'Content-Type': 'application/json'
    },
    data: {
      user_id: getApp().globalData.openId
    },
    success: function(res) {
      console.log(res)
      if(res.statusCode==200){
        if (res.data.code == 0) {
          if (res.data.data.length == 1) {
            getApp().globalData.userInfo = res.data.data[0]
            taskFunc.getSkillList()
            taskFunc.getLanguageList()
            publicFuc.getCity(that)
          } else {
            wx.hideLoading()
            that.setData({
              showflag: true
            })
          }
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
     
    },
    fail: function(res) {
      wx.showToast({
        title: '连接服务器失败',
        icon: 'none'
      })
    }
  })
}

function signUp() {
  wx.request({
    url: getApp().globalData.host + 'signUp',
    method: 'POST',
    dataType: "json",
    header: {
      'Content-Type': 'application/json'
    },
    data: {
      user_id: getApp().globalData.openId,
      user_info: getApp().globalData.userInfo
    },
    success: function(res) {
      wx.hideLoading()
      if (res.data.code == 0) {
        // getApp().globalData.userInfo = res.data.data[0]
        taskFunc.getSkillList()
        taskFunc.getLanguageList()
        publicFuc.getCity()
      } else {
        wx.showToast({
          title: '获取失败',
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

function saveResumInfo(that) {
  if (that.data.user_resume_info.work_years == '') {
    wx.showToast({
      title: '请填写工作经验',
      icon: 'none'
    })
  } else if (that.data.user_resume_info.expect_salary == '') {
    wx.showToast({
      title: '请填写期望日薪',
      icon: 'none'
    })
  } else if (isNaN(that.data.user_resume_info.work_years)) {
    wx.showToast({
      title: '工作时间应为阿拉伯数字',
      icon: 'none'
    })
  } else if (that.data.user_resume_info.work_years < 1 || that.data.user_resume_info.work_years > 99) {
    wx.showToast({
      title: '工作时间应在1~99之间',
      icon: 'none'
    })
  } else if (isNaN(that.data.user_resume_info.expect_salary)) {
    wx.showToast({
      title: '期望日薪应为阿拉伯数字',
      icon: 'none'
    })
  } else if (that.data.user_resume_info.expect_salary < 1 || that.data.user_resume_info.expect_salary > 9999) {
    wx.showToast({
      title: '期望日薪应在1~9999之间',
      icon: 'none'
    })
  } else if (that.data.user_resume_info.skill_des == '') {
    wx.showToast({
      title: '请填写技能描述',
      icon: 'none'
    })
  } else if (that.data.user_resume_info.experience_des == '') {
    wx.showToast({
      title: '请填写项目经验',
      icon: 'none'
    })
  } else {
    wx.showLoading({
      title: '保存中',
    })
    that.setData({
      'user_resume_info.user_id':getApp().globalData.openId
    })
    wx.request({
      url: getApp().globalData.host + 'saveResumeInfo',
      method: 'POST',
      dataType: "json",
      header: {
        'Content-Type': 'application/json'
      },
      data: {
        user_resume_info: that.data.user_resume_info
      },
      success: function(res) {
        wx.hideLoading()
        if (res.statusCode == 200) {
          if (res.data.code == 0) {
            wx.showToast({
              title: res.data.data,
              icon: 'none'
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
      },
      fail: function(res) {
        wx.showToast({
          title: '连接服务器失败',
          icon: 'none'
        })
      }
    })
  }
}

function getResumeInfo(that, user_id, flag) {
  wx.showLoading({
    title: '获取数据中',
  })
  wx.request({
    url: getApp().globalData.host + 'getResumeInfo',
    method: 'POST',
    dataType: "json",
    header: {
      'Content-Type': 'application/json'
    },
    data: {
      flag:flag,
      user_id: user_id
    },
    success: function(res) {
      console.log(res.data.data[0])
      wx.hideLoading()
      if (res.statusCode == 200) {
        if (res.data.code == 0 && res.data.data.length == 1) {
          var skill_item = []
          for (var i = 1; i < getApp().globalData.skillList.length; i++) {
            var checked=0
            if (res.data.data[0].skill_lables.indexOf(getApp().globalData.skillList[i].id)!=-1){
              checked =1
            }
            skill_item.push({
              id: getApp().globalData.skillList[i].id,
              name: getApp().globalData.skillList[i].name,
              ischeck: checked,
            })
          }
          that.setData({
            skill_item: skill_item,
            user_resume_info: res.data.data[0]
          })
        } else {
          wx.showToast({
            title: '您还没填写简历哦',
            icon: 'none'
          })
          var skill_item = []
          for (var i = 1; i < getApp().globalData.skillList.length; i++) {
            skill_item.push({
              id: getApp().globalData.skillList[i].id,
              name: getApp().globalData.skillList[i].name,
              ischeck: 0,
            })
          }
          that.setData({
            skill_item: skill_item,
          })
        }
      } else {
        wx.showToast({
          title: '连接服务器失败',
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

function getMyCollection(that) {
  wx.showLoading({
    title: '获取数据中',
  })
  wx.request({
    url: getApp().globalData.host + 'getMyCollection',
    method: 'POST',
    dataType: "json",
    header: {
      'Content-Type': 'application/json'
    },
    data: {
      user_id: getApp().globalData.openId
    },
    success: function(res) {
      wx.hideLoading()
      if (res.statusCode == 200) {
        if (res.data.code == 0 && res.data.data.length != 0) {
          that.setData({
            list: res.data.data,
          })
          // let map = new Map()
          // map.set(0, "未投标").set(1, "选标中").set(2, "开发中").set(3, "验收中").set(4, "已结束")
          // that.data.list.forEach((item, index) => {
          //   that.setData({
          //     ["list[" + index + "].status"]: map.get(item.status)
          //   })
          // })
        }
      } else {
        wx.showToast({
          title: '连接服务器失败',
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

function deleteMyCollection(that, task_id) {
  wx.request({
    url: getApp().globalData.host + 'deleteMyCollection',
    method: 'POST',
    dataType: "json",
    header: {
      'Content-Type': 'application/json'
    },
    data: {
      user_id: getApp().globalData.openId,
      task_id: task_id
    },
    success: function(res) {
      if (res.statusCode == 200) {
        if (res.data.code == 0) {
          wx.showToast({
            title: '删除成功',
            icon: 'none'
          })
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
    },
    fail: function(res) {
      wx.showToast({
        title: '连接服务器失败',
        icon: 'none'
      })
    }
  })
}

function getMessage(that) {
  wx.request({
    url: getApp().globalData.host + 'getMessage',
    method: 'POST',
    dataType: "json",
    header: {
      'Content-Type': 'application/json'
    },
    data: {
      user_id: getApp().globalData.openId,
    },
    success: function(res) {
      console.log(res)
      wx.stopPullDownRefresh()
      if (res.statusCode == 200) {
        if (res.data.code == 0) {
          that.setData({
            notifylist: res.data.data
          })
          var count = 0
          for (var i = 0; i < res.data.data.length; i++) {
            if (res.data.data[i].ischeck == 0) {
              count++
            }
          }
          if (count != 0) {
            that.setData({
              hasMessage: true,
              count:count
            })
          } else {
            that.setData({
              hasMessage: false
            })
          }
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

function checkMessage(id) {
  wx.request({
    url: getApp().globalData.host + 'checkMessage',
    method: 'POST',
    dataType: "json",
    header: {
      'Content-Type': 'application/json'
    },
    data: {
      user_id: getApp().globalData.openId,
      message_id: id
    },
    success: function(res) {
      console.log(res)
      if (res.statusCode == 200) {
        if (res.data.code != 0) {
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

function deleteMessage(that, id, e) {
  wx.request({
    url: getApp().globalData.host + 'deleteMessage',
    method: 'POST',
    dataType: "json",
    header: {
      'Content-Type': 'application/json'
    },
    data: {
      user_id: getApp().globalData.openId,
      message_id: id
    },
    success: function(res) {
      console.log(res)
      if (res.statusCode == 200) {
        if (res.data.code == 0) {
          that.data.notifylist.splice(e.currentTarget.dataset.index, 1)
          // 添加后台删除
          that.setData({
            notifylist: that.data.notifylist
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
    },
    fail: function() {
      wx.showToast({
        title: '连接服务器失败',
        icon: 'none'
      })
    }
  })
}

module.exports = {
  login: login,
  signUp: signUp,
  checkSignup: checkSignup,
  saveResumInfo,
  getResumeInfo,
  getMyCollection,
  deleteMyCollection,
  getResumeInfo,
  getMessage,
  checkMessage,
  deleteMessage
}