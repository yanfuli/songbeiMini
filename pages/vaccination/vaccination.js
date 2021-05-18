const { toast } = require("../../utils/Coca");
var util = require('../../utils/util.js');
// pages/vaccination/vaccination.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    timeData:util.formatTime(new Date())
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.getInfo();
    console.log(that.data.timeData)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  getInfo(){
    let that = this;
    wx.showLoading({
      title: '正在加载',
      mask: true,
    })
      let data = {
        memberId:getApp().Coca.getStorageSync('userInfo').idcard
      }
      console.log(getApp().Coca.getStorageSync('userInfo'))
      wx.request({
        url: getApp().data.domain1 + '/business/vaccinate/query',
        method: 'GET',
        data: data,
        header: {
          "Content-Type": "application/json",
          "Authorization":getApp().Coca.getStorageSync('token')
        },
        success: function (res) {
          wx.hideLoading()
          if(res.data.code==0){
            that.setData({
              allData:res.data.data
            })
          }
          console.log(res)
        },
        fail: function (error) {
          wx.hideLoading()
          console.log(error)
          that.toast("请下拉刷新在试下")
        }
      })
  },
  getInfo(){
    let that = this;
    wx.showLoading({
      title: '正在加载',
      mask: true,
    })
      let data = {
        idCode:getApp().Coca.getStorageSync('userInfo').idcard
        // idCode:'232324198810265587'
      }
      wx.request({
        url: getApp().data.domain2 + '/healthyweb/other/status',
        method: 'GET',
        data: data,
        header: {
          "Content-Type": "application/json",
          "Authorization":getApp().Coca.getStorageSync('token')
        },
        success: function (res) {
          wx.hideLoading()
          if(res.data.code==0){
            that.setData({
              colorbg:res.data.data.color
            })
          }
          console.log(res)
        },
        fail: function (error) {
          wx.hideLoading()
          console.log(error)
          that.toast("请下拉刷新在试下")
        }
      })
  },
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

  }
})