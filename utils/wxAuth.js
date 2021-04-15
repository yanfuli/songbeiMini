var Coca = require("Coca.js")

function isUID(){

  var uid = getApp().data.uid

  if (uid > 0){

    return true
  }

  // uid = Coca.getStorageSync("uid")
  // getApp().data.uid = uid

  if (uid > 0) {

    return true

  }else{

    // this.openSetting()
    return false
  }

}

function openSetting() {
  var that = this
  if (wx.openSetting) {
    wx.openSetting({
      success: function (res) {
        //尝试再次登录
        if (res.authSetting["scope.userInfo"]) {
          that.getUserInfo()
        } else {
          wx.showModal({
            title: '授权提示',
            content: '小程序需要您的微信授权才能使用哦~ 错过授权页面的处理方法：删除小程序->重新搜索进入->点击授权按钮'
          })
        }

      }
    })
  } else {
    wx.showModal({
      title: '授权提示',
      content: '小程序需要您的微信授权才能使用哦~ 错过授权页面的处理方法：删除小程序->重新搜索进入->点击授权按钮'
    })
  }
}

function getUserInfo() {

  // wx.showLoading({
  //   title: '加载中',
  // })

  var that = this
  var res_code = ""
  // 登录
  wx.login({

    success: res => {
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      res_code = res.code

      wx.hideLoading()
      // 获取用户信息
      wx.getUserInfo({
        success: res => {
          // 可以将 res 发送给后台解码出 unionId
          getApp().data.userInfo = res.userInfo
          //登录
          
          that.requestLogin(res_code, res.userInfo)
        },

        fail: res => {
          wx.hideLoading()
        }

      })
    }
  })

}

function requestLogin(code, userInfo) {

  var data = {
    code: code, nickName: userInfo.nickName,
    avatar: userInfo.avatarUrl, gender: userInfo.gender, province: userInfo.province,
    city: userInfo.city, country: userInfo.country
  }
  
  getApp().Coca.http_post("auth/login", data, function (e) {
    if (e.code == 200) {

      getApp().data.uid = e.user_id
      Coca.setStorageSync("uid", e.user_id)

    } else {
      // getApp().Coca.toast(e.message)
    }
  })
}

module.exports = {

  isUID: isUID,
  openSetting: openSetting,
  getUserInfo: getUserInfo,
  requestLogin: requestLogin
}