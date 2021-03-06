// components/shouquan-dialog/shouquan-dialog.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title:{
      type: String,
      value:'弹窗标题'
    },
    content: {
      type: String,
      value: '弹窗内容'
    },
    btnOk: {
      type: String,
      value: '确认弹窗'
    },
    uid:{
      type: String,
      value: 'default value',

    }
  },
  lifetimes: {
    attached() {
      // 在组件实例进入页面节点树时执行
      console.log(this.data.uid)
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    isShow:true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showDailog:function(){
      var that = this;
      that.setData({
        isShow: false
      })
    },
    hidDailog:function(){
      var that = this;
      that.setData({
        isShow: true
      })
    },
    customMethod() {
      console.log(uid)
    },
    // 获取用户信息
    getUserInfo: function(e) {
      var that = this;
      that.setData({
        isShow: true
      })
      wx.getUserProfile({
        desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        lang:'zh_CN',
        success: (ress) => {
          console.log(ress);
          that.triggerEvent("success", {userInfo:ress.userInfo });
        },
        fail:(ress)=>{
          console.log(ress)
        }
      })
    },
    // 获取用户微信信息
    getWxInfo(){
      var that = this;
      var userInfo = that.data.userInfo;
      var uid = that.data.userId;
      var data = {
        openid:that.data.openid
      }
      console.log(data)
      getApp().Coca.http_get("/user/loginByOpenId", data, function (e) {
        if (e.code == 200) {
          console.log(e)
          var token = e.token
          var user = that.data.userInfo;
          that.triggerEvent("success", { token:token,userInfo:userInfo });
        } else {
          getApp().Coca.toast(e.msg)
        }
      })
    }
  }
})
