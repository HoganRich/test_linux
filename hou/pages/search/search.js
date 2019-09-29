// pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchkey:[],
    recommendTask:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      recommendTask: JSON.parse(options.recommendTask)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const value = wx.getStorageSync('name')
    let harr=value.split(';')
    //删除最后一项空内容
    harr.pop()
    // console.log(harr)
    for(let item of harr){
        this.data.searchkey.push(item)
    }
    this.setData({
      searchkey: this.data.searchkey
    })
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
  search:function(e){
    var keyvalue = e.detail.value
    if (keyvalue ==undefined){
      keyvalue = e.currentTarget.dataset.key
    }
    console.log(keyvalue)
    setTimeout(() => {
    if (keyvalue != "" || keyvalue.length!=0){
      try {
        const value = wx.getStorageSync('name')
        const harr = value.split(';')
        harr.pop()
        if (harr.indexOf(keyvalue) > -1) {
          // 交换数组中的位置
          this.data.searchkey.splice(harr.indexOf(keyvalue), 1)
          this.data.searchkey.unshift(keyvalue)
          this.setData({
            searchkey: this.data.searchkey
          })
          // 交换缓存中首位和新搜索的item
          let exarr = value.split(';')
          exarr.pop()
          exarr.splice(exarr.indexOf(keyvalue), 1)
          exarr.unshift(keyvalue)
          // console.log(exarr)
          let str = exarr.join(';') + ';'
          wx.setStorageSync('name', str)
        } else {
          //如果缓存历史记录到达指定数量删除最后一个记录
          if (harr.length === 5) {
            harr.pop()
            let str = harr.join(';') + ';'
            wx.setStorageSync('name', keyvalue + ';' + str)
          } else {
            wx.setStorageSync('name', keyvalue + ';' + value)
          }
          //如果展示记录到达指定数量删除最后一个记录  
          if (this.data.searchkey.length === 5) {
            this.data.searchkey.pop()
          }
          //新增搜索记录到历史记录头部
          this.data.searchkey.unshift(keyvalue)
          this.setData({
            searchkey: this.data.searchkey
          })
        }
      } catch (e) {
        console.error(e)
      }
    }
    }, 500)

    wx.navigateTo({
      url: '../task_list/task_list?keyword=' + keyvalue
    })

    this.setData({
      keyword: null
    })

  },
  delete:function(e){
    try {
      const value = wx.getStorageSync('name')
      let str = value.replace(this.data.searchkey[e.target.dataset.index]+';','')
      wx.setStorageSync('name', str)
      this.data.searchkey.splice(e.target.dataset.index, 1)
    } catch (e) {
      console.error(e)
    }
    this.setData({
      searchkey: this.data.searchkey
    })
  },
  deleteAll:function(e){
    wx.showModal({
      title: '提示',
      content: '确定删除所有的历史记录',
      success:(res)=> {
        if (res.confirm) {
          this.data.searchkey.splice(0, this.data.searchkey.length)
          this.setData({
            searchkey: this.data.searchkey
          })
          try{
            wx.removeStorageSync('name')
          }catch(e){
            console.error(e)
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
  },
  cancel: function () {
    this.setData({
      keyword: null
    })
  },
  historysearch:function(e){
    wx.navigateTo({
      url: '../task_list/task_list?keyword=' + e.currentTarget.dataset.key
    })
    setTimeout(()=>{
      const keyvalue = e.currentTarget.dataset.key
      const value = wx.getStorageSync('name')
      const harr = value.split(';')
      harr.pop()
      // 交换数组中的位置
      this.data.searchkey.splice(harr.indexOf(keyvalue), 1)
      this.data.searchkey.unshift(keyvalue)
      this.setData({
        searchkey: this.data.searchkey
      })
      // 交换缓存中首位和新搜索的item
      let exarr = value.split(';')
      exarr.pop()
      exarr.splice(exarr.indexOf(keyvalue), 1)
      exarr.unshift(keyvalue)
      let str = exarr.join(';') + ';'
      wx.setStorageSync('name', str)
    },500)
  }







})