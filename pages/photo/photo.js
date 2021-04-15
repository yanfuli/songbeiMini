// pages/photo/photo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    https:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getHttp()
  },
  // 获取
  getHttp(){
    let that = this;
      let data = {
      }
      getApp().Coca.http_get('/user/getUrl', data, function (e) {
        console.log(e)
          if(e.code==200){
            var data = JSON.parse(e.data)
            console.log(data)
            var t = data.url.split('?')[1]
            that.setData({
              https:'https://m.hzdssoft.com/#/pages/randomPhoto/randomPhoto?'+data
            })
            console.log(data)
          }else if(e.code==401){
            getApp().Coca.toast('请重新登录')
            wx.removeStorageSync('token')
            wx.removeStorageSync('userInfo')
            wx.switchTab({
              url: '/pages/index/index',
            })
          }
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

  }
})