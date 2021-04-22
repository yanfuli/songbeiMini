//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    tokenId:''
  },
  onLoad: function () {

  },
  getname(e){
      let that = this;
      that.setData({
          name: e.detail.value
      })
  },
  getIdcard(e){
    let that = this;
    that.setData({
        idCard: e.detail.value
    })
  },
    // 获取 BizToken
getBizToken(){
    let that = this;
    if(!that.data.name){
        getApp().Coca.toast('请填写真实姓名')
        return false
    }
    if(!that.data.idCard){
        getApp().Coca.toast('请填写身份证号码')
        return false
    }
    let data = {
        idCard:that.data.idCard,
        name:that.data.name
    }
    console.log(data)
    getApp().Coca.http_get('/faceid/getBizToken', data, function (e) {
        console.log(e)
      if(e.code==200){
        let data = JSON.parse(e.data)
        console.log(data)
        that.setData({
            BizToken:data.BizToken
        })
        that.gotoVerify();
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
        // getApp().Coca.setStorageSync('sessionKey',e.data.sessionKey)
        that.userInfo();
      } else {
        getApp().Coca.toast(e.msg)
      }
    })
  },

  // 单击某个按钮时，触发该函数
    gotoVerify: function () {
        let that = this;
        // 调用实名核身功能
        wx.startVerify({
            data: {
                token: that.data.BizToken // BizToken
            },
            success: (res) => { // 验证成功后触发
                // res 包含验证成功的token, 这里需要加500ms延时，防止iOS下不执行后面的逻辑
                console.log(res)
                setTimeout(() => {
                    // 验证成功后，拿到token后的逻辑处理，具体以客户自身逻辑为准
                    that.requestLogin();
                }, 500);
            },
            fail: (err) => {  // 验证失败时触发
                // err 包含错误码，错误信息，弹窗提示错误
                setTimeout(() => {

                    wx.showModal({
                        title: "提示",
                        content: err.ErrorMsg,
                        showCancel: false
                    })
                }, 500);
            }
        });
    },
    // 身份验证
    userInfo(){
        let that = this;
        let data = {
            // bizToken: that.data.BizToken,
            encryptedData:getApp().Coca.getStorageSync('userInfo').encryptedData,
            iv:getApp().Coca.getStorageSync('userInfo').iv,
            rawData:getApp().Coca.getStorageSync('userInfo').rawData,
            // sessionKey:getApp().Coca.getStorageSync('sessionKey'),
            signature:getApp().Coca.getStorageSync('userInfo').signature,
        }
        console.log(data)
        getApp().Coca.http_post('/user/setInfo', data, function (e) {
            console.log(e)
            if(e.data.code==200){
                that.yanzheng();
            }else{
              getApp().Coca.toast(e.data.msg)

            }
        })
    },
    yanzheng(){
      let that = this;
        let data = {
            bizToken: that.data.BizToken,
        }
        console.log(data)
        getApp().Coca.http_post('/faceid/result', data, function (e) {
            console.log(e)
            if(e.data.code==200){
              getApp().Coca.setStorageSync('loginStatus','1')
                wx.switchTab({
                    url: '/pages/index/index',
                })
            }else{
                getApp().Coca.tishi('确定',e.data.msg,function(){
                    wx.removeStorageSync('token')
                    wx.removeStorageSync('userInfo')
                    wx.switchTab({
                      url: '/pages/index/index',
                    })
                })
            }
        })
    },
    //身份证拍照登录
    chosephon: function (e) {
        var that = this;
        wx.chooseImage({
          count: 1, 
          sizeType: ['original', 'compressed'], 
          sourceType: ['album', 'camera'], 
          success: function (res) {
            wx.showLoading({
              title:"加载中",
              mask:true
            });
            var imgs=res.tempFilePaths[0];
            console.log(res);
            wx.getFileSystemManager().readFile({
              filePath: imgs, 
              encoding: 'base64', 
              success: function(ress) { //成功的回调
                console.log(ress)
                var base64img = unescape(decodeURI(ress.data));  
                base64img="data:image/png;base64,"+base64img;
                var urls=app.data.domain;
                that.actioncnt(urls,base64img)
            }
            })
            
          },
          fail: function (res) {
            console.log(res);
          }
        })
      },
      //存储token
      actioncnt(urls,base64img){  
        var that = this;
        if(getApp().Coca.getStorageSync('token')){
          that.imgUrlfun(urls,base64img)
        }else{
          var data = {
            code: getApp().Coca.getStorageSync('code'),
          }
          console.log(data)
          getApp().Coca.http_get("/user/loginByCode", data, function (e) {
            console.log(e);
            if (e.code == 200) {
              getApp().Coca.setStorageSync('token',e.data.token)
              getApp().Coca.setStorageSync('openId',e.data.openId)
              that.imgUrlfun(urls,base64img)
            } else {
              getApp().Coca.toast(e.msg)
            }
          })
        }
       
    },
    //验证身份证照片
    imgUrlfun(urls,base64img){
      var that = this;
      wx.request({
        url:urls+"/faceid/idCardOcr",
        data: {
          imageBase64: base64img,
        },
        header: {
          'content-type': 'application/json',
          "Authorization":getApp().Coca.getStorageSync('token')
        }, 
        method: "POST",
        success: function (tes) {
          console.log(tes);
          if(tes.data.code==200){
            getApp().Coca.setStorageSync('loginStatus','1')
            wx.switchTab({
                url: '/pages/index/index',
            })
            wx.hideLoading();
          }else if(tes.data.code==500){
            wx.hideLoading();
            wx.showToast({
              title:tes.data.msg,
              icon: 'none'
            });
          }
          
          
        },
        fail: function (tes) {
          wx.hideLoading();
          console.log(tes);
          wx.showToast({
            title: "连接异常",
            icon: 'none',
            mask: true
          })
        }
      });
    }  
})
