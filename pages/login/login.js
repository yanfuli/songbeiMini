//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
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
    // getUser(){
    //   let that = this;
    //     let data = {
    //     }
    //     getApp().Coca.http_get('/user/getInfo', data, function (e) {
    //       console.log(e)
    //         if(e.code==200){
    //             console.log(e)
    //             that.setData({
    //               userInfo:e.data
    //             })
    //         }
    //     })
    // },
    getUserInfo: function(e) {
      var that = this;
      wx.getUserProfile({
        desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        lang:'zh_CN',
        success: (ress) => {
          console.log(ress);
          wx.login({
            success(res) {
              console.log(res)
              getApp().Coca.setStorageSync('code', res.code);
              getApp().Coca.setStorageSync('userInfo', ress.userInfo);
              //  wx.reLaunch({
              //   url: '/pages/login2/login2',
              // })
              that.requestLogin();
            },
            fail(res){
              console.log(res)
            }
          })
        },
        fail:(ress)=>{
          console.log(ress)
        }
      })
    },
    //获取用户openid 
requestLogin: function () {
    var that = this;
    var data = {
      code: getApp().Coca.getStorageSync('code'),
    }
    console.log(data)
    getApp().Coca.http_get("/user/loginByCode", data, function (e) {
      if (e.code == 200) {
        console.log(e)
        getApp().Coca.setStorageSync('token',e.data.token)
        getApp().Coca.setStorageSync('openId',e.data.openId)
        that.userInfo();
      } else {
        getApp().Coca.toast(e.msg)
      }
    })
  },
  userInfo(){
    let that = this;
    let data = {
        // bizToken: that.data.BizToken,
        avatarUrl:getApp().Coca.getStorageSync('userInfo').avatarUrl,
        nickName:getApp().Coca.getStorageSync('userInfo').nickName,
        gender:getApp().Coca.getStorageSync('userInfo').gender,
        country:getApp().Coca.getStorageSync('userInfo').country,
        province:getApp().Coca.getStorageSync('userInfo').province,
        city:getApp().Coca.getStorageSync('userInfo').city,
        language:getApp().Coca.getStorageSync('userInfo').language  
    }
    console.log(data)
    getApp().Coca.http_post('/user/setInfo2', data, function (e) {
        console.log(e)
        if(e.data.code==200){
            // that.yanzheng();
            wx.reLaunch({
              url: '/pages/login2/login2',
            })
        }else{
          getApp().Coca.toast(e.data.msg)

        }
    })
},
    onShow:function(){
      let that = this;
      if(!that.data.userInfo){
        // that.getUser();
      }
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
          }
          that.setData({
            userInfo:''
          })
      })
    },
    onReady: function () {

    },
      // 点击授权按钮
      success: function (e) {
        console.log(e)
        var that = this;
        wx.login({
          success(res) {
            console.log(res)
            getApp().Coca.setStorageSync('code', res.code);
            getApp().Coca.setStorageSync('userInfo', e.detail.userInfo);
             wx.reLaunch({
              url: '/pages/login2/login2',
            })
          },
          fail(res){
            console.log(res)
          }
        })
      },

      // 判断是否授权
      isShou: function () {
        var that = this;
        var token = getApp().Coca.getStorageSync('token');
        var loginStatus = getApp().Coca.getStorageSync('loginStatus');
        if (token != '' && token != undefined && token != null && loginStatus!='') {
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
})
