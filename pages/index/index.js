//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    idx:1,
    currentIndex: 0,  //banner活动页
    banner:['/images/banner.png'],
    tabArr:['icon1','icon4','icon3','icon5','icon2','icon7'],
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
                  getApp().Coca.setStorageSync('userInfo', e.data);
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
      let that = this;
      if(that.data.userInfo){
        wx.navigateTo({
          url: '/pages/personal/personal',
        })
      }else{
        wx.navigateTo({
          url: '/pages/login/login',
        })
      }
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
      // 点击卡片
      tapCard(){
        wx.showModal({
          title: '提示',
          content: '此功能暂未开启，敬请期待！',
          success (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
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
      },
      jiaofei(){
        wx.navigateToMiniProgram({
          appId: 'wxd2ade0f25a874ee2',
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
      },
      yueche(){
        wx.navigateToMiniProgram({
          appId: 'wxaf35009675aa0b2a',
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
      },
      ditu(){
        wx.navigateToMiniProgram({
          appId: 'wx7643d5f831302ab0',
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
      },
      jipiao(){
        wx.navigateToMiniProgram({
          appId: 'wx0e6ed4f51db9d078',
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
      },
      goupiao(){
        wx.navigateToMiniProgram({
          appId: 'wxa51f55ab3b2655b9',
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
      },
      shangpu(){
        wx.navigateToMiniProgram({
          appId: 'wxde8ac0a21135c07d',
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
      },
      yimiao(){
        wx.navigateToMiniProgram({
          appId: 'wxb032bc789053daf4',
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
      },
      yimiao1(){
        var that = this;
        if(that.data.userInfo){
          wx.navigateTo({
            url: "/pages/vaccination/vaccination",
          })
        }else{
          getApp().Coca.toast('您还没登录，请先登录！')
        }
      }
})
