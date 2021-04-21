//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    idx:1,
    currentIndex: 0,  //banner活动页
    banner:['/images/bnner.png'],
    tabArr:['公共服务','服务','居民物业服务','党建引领','政务服务','便民服务'],
    idx:0
  },
  onLoad: function () {
    let that = this;
  },
    //   点击tab
    bindItem(e){
        this.setData({
            idx:e.currentTarget.dataset.idx
        })
    },
    // 获取用户信息
    getUser(){
      let that = this;
        let data = {
        }
        getApp().Coca.http_get('/user/getInfo', data, function (e) {
          console.log(e)
            if(e.code==200){
                console.log(e)
                if(getApp().Coca.getStorageSync('loginStatus')){
                  that.setData({
                    userInfo:e.data
                  })
                }
                
            }
        })
    },
    onShow:function(){
      let that = this;
      if(!that.data.userInfo){
        that.getUser();
      }
    },
    // 登录
    goLogin(){
      // this.isShou();
      wx.navigateTo({
        url: '/pages/login/login',
      })
    },
    // 退出
    goOut(){
      let that = this;
      let data = {
      }
      getApp().Coca.http_post('/user/logout', data, function (e) {
        console.log(e)
          if(e.data.code==200){
              wx.removeStorageSync('token')
              wx.removeStorageSync('userInfo')
              wx.removeStorageSync('loginStatus')
          }
          that.setData({
            userInfo:''
          })
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
        getApp().Coca.setStorageSync('code', e.detail.code);
        getApp().Coca.setStorageSync('userInfo', e.detail.userInfo);
        wx.reLaunch({
          url: '/pages/renzheng/renzheng',
        })
      },
      // 判断是否授权
      isShou: function () {
        var that = this;
        var token = getApp().Coca.getStorageSync('token');
        console.log(token)
        if (token != '' && token != undefined && token != null) {
          that.selectComponent("#shouDialog").hidDailog();
          that.getUser();
        } else {
          that.selectComponent("#shouDialog").setData({
            title: '温馨提示',
            content: '授权之后可以获取更多的权利',
            btnOk: '确定'
          })
          that.selectComponent("#shouDialog").showDailog();
        }
      },
      // 随手拍
      goPhoto(){
        wx.navigateTo({
          url: '/pages/photo/photo',
        })
      },
      // 龙江健康码
      healthCode(){
        wx.navigateToMiniProgram({
          appId: 'wx46842a007911c80d',
          path: '',
          extraData: {
            foo: 'bar'
          },
          envVersion: 'release',
          success(res) {
            console.log(res)
          },
          fail(res){
            console.log(res)
          }
        })
      }
})
