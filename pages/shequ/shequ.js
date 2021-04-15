// pages/shequ/shequ.js
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
    if(getApp().Coca.getStorageSync('token')){
      this.setData({
        token: getApp().Coca.getStorageSync('token')
      })
      this.getHttp();
    }else{
      this.isShou();
    }
  },
  // 获取接口
  getHttp(){
    let that = this;
      let data = {
      }
      getApp().Coca.http_get('/user/getUrl', data, function (e) {
        console.log(e)
          if(e.code==200){
            var data = JSON.parse(e.data)
              that.setData({
                https:data.url
              })
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
  onReady: function () {
    var that = this;
    // that.shouDialog = that.selectComponent('#shouDialog');
    that.shouDialog = that.selectComponent("#shouDialog");
  },
    // 点击授权按钮
    success: function (e) {
      console.log(e)
      var that = this;
      if(e.detail.userInfo.errMsg=='getUserInfo:ok'){
        getApp().Coca.setStorageSync('code', e.detail.code);
        getApp().Coca.setStorageSync('userInfo', e.detail.userInfo);
        wx.reLaunch({
          url: '/pages/renzheng/renzheng',
        })
      }else{
        getApp().Coca.toast('获取用户信息失败')
        // wx.switchTab({
        //   url: '/pages/index/index',
        // })
      }
    },
    // 判断是否授权
    isShou: function () {
      var that = this;
      var token = getApp().Coca.getStorageSync('token');
      console.log(token)
      if (token != '' && token != undefined && token != null) {
        that.selectComponent("#shouDialog").hidDailog();
        that.getHttp();
      } else {
        that.selectComponent("#shouDialog").setData({
          title: '温馨提示',
          content: '授权之后可以获取更多的权利',
          btnOk: '确定'
        })
        that.selectComponent("#shouDialog").showDailog();
      }
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