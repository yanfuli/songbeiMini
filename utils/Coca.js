var md5 = require("md5.js") 
var signKey = "42ec690477c6873a336106b6f9318b3b"


//获取当前时间戳
function getCurrentTimeStamp(){
  var timestamp = Date.parse(new Date());
  timestamp = timestamp / 1000;
  return timestamp;
}
//时间string转时间戳
function getTimeStamp(stringTime){
  
  var timestamp = Date.parse(new Date(stringTime));
  timestamp = timestamp / 1000;
  
  return timestamp;
}

//时间戳转时间string
function getTime(number) {
  var n = number * 1000;
  var date = new Date(n);
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  var H = date.getHours() < 10 ? '0' + date.getHours() : date.getHours() + ':';
  var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
  return (Y + M + D + " " + H + m)
}  


function formatLocation(longitude, latitude) {
  if (typeof longitude === 'string' && typeof latitude === 'string') {
    longitude = parseFloat(longitude)
    latitude = parseFloat(latitude)
  }

  longitude = longitude.toFixed(2)
  latitude = latitude.toFixed(2)

  return {
    longitude: longitude.toString().split('.'),
    latitude: latitude.toString().split('.')
  }
}

function toast(mes,bool){

  // var icon = bool ? "/images/icon/warning.png" : "/images/icon/warning.png"
//  console.log(mes)
  wx.showToast({
    title: mes,
    duration: 3000,
    icon:'none'
  })
}


function http_get(url, data, callBack, hideHUD = true) {

  if (hideHUD == true) {
    wx.showLoading({
      title: '加载中',
    })
  }

  if (Object.keys(data).length > 0) {
    var sign = ""
    for (var Key in data) {
      sign += Key + '=' + data[Key] + '&'
    }
    sign = sign + signKey
    data["sign"] = md5.hexMD5(sign)
  }

  var that = this
  wx.request({
    url: getApp().data.domain + url,
    method: 'GET',
    data: data,
    header: {
      "Content-Type": "json",
      "Authorization":getApp().Coca.getStorageSync('token')
    },
    success: function (res) {
      wx.hideLoading()
      console.log(res.data)
      callBack(res.data)
      wx.stopPullDownRefresh()
    },
    fail: function (error) {
      wx.hideLoading()
      that.toast("请下拉刷新在试下")
      wx.stopPullDownRefresh()
      callBack("400")
    }
  })
}
function http_post(url, data, callBack, hideHUD = true) {

  if (hideHUD == true) {
    wx.showLoading({
      title: '加载中',
    })
  }
  
  // if (Object.keys(data).length > 0){
  //   var sign = ""
  //   for (var Key in data) {
  //     sign += Key + '=' + data[Key] + '&'
  //   }
  //   sign = sign + signKey
  //   data["sign"] = md5.hexMD5(sign)
  // }

  var that = this
  wx.request({
    url: getApp().data.domain + url,
    method: 'POST',
    // data: this.json2Form(data),
    data: data,
    header: {
      "Content-Type": "application/json",
      // "Content-Type": "application/x-www-form-urlencoded",
      "Authorization":getApp().Coca.getStorageSync('token')
    },
    success: function (res) {
      wx.hideLoading()
      callBack(res)
      wx.stopPullDownRefresh()
      
    },
    fail: function (error) {
      wx.hideLoading()
      that.toast("请下拉刷新在试下")
      wx.stopPullDownRefresh()
      callBack("400")
    }
  })
}

function http_uploadFile(url, data, name, filePath, callBack){

  wx.showLoading({
    title: '加载中',
  })

  wx.uploadFile({
    url: getApp().data.domain + url,
    filePath: filePath,
    name: name,
    formData: data,
    
    success: function (res) {
      wx.hideLoading()
      // var data = JSON.parse(res.data);
      // console.log(res.data)
      callBack(res.data)
      
    },
    fail: function (error) {
      wx.hideLoading()
    }
  })
}

function json2Form(json) {
  var str = [];
  for (var p in json) {
    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p]));
  }
  return str.join("&");
}  

function alert(cencel, confirm, mes, callBack){
  wx.showModal({
    // title: title?title:'提示',
    content: mes?mes:'',
    cancelText: cencel ? cencel : '',
    cancelColor:'#999999',
    confirmText: confirm ? confirm : '',
    confirmColor:'#1487de',
    success: function (res) {
      if (res.confirm) {
        callBack(res)
      }
    }
  })
}
function tishi(confirm, mes, callBack) {
  wx.showModal({
    content: mes ? mes : '',
    showCancel: false,
    confirmText: confirm ? confirm : '',
    confirmColor: '#4393f4',
    success: function (res) {
      if (res.confirm) {
        callBack()
      }
    }
  })
}
function validate_phone(phone){
  var re = /^1\d{10}$/;
  return re.test(phone)
}
function validate_number(num) {
  var re = /^[0-9]{1}/;
  return re.test(num)
}
function validate_email(email) {
  var re = /[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}/;
  return re.test(email)
}
function validate_pwd(pwd) {
  var re = /^[a-zA-Z0-9]{6,12}$/;
  return re.test(pwd)
}

function cameraSheet(callBack){
  wx.showActionSheet({
    itemList: ['拍照上传', '从相册选取'],
    success: function (res) {

      if (res.tapIndex == 0) {
        wx.chooseImage({
          count: 1,
          sizeType: ['original', 'compressed'],
          sourceType: ['camera'],
          success: function (res) {

            var tempFilePath = res.tempFilePaths[0]
            callBack(tempFilePath)
          }
        })

      } else if (res.tapIndex == 1) {

        wx.chooseImage({
          count: 1,
          sizeType: ['original', 'compressed'],
          sourceType: ['album'],
          success: function (res) {

            var tempFilePath = res.tempFilePaths[0]
            callBack(tempFilePath)
          }
        })

      }
    },
    fail: function (res) {
      
    }
  })
}

// 多张图片上传
function uploadimg(data) {
  var that = this,
    i = data.i ? data.i : 0,//当前上传的哪张图片
    success = data.success ? data.success : 0,//上传成功的个数
    fail = data.fail ? data.fail : 0;//上传失败的个数
    wx.uploadFile({
    url: data.url,
    filePath: data.path[i],
    name: 'file',//这里根据自己的实际情况改
    formData: null,//这里是上传图片时一起上传的数据
    success: (resp) => {
      success++;//图片上传成功，图片上传成功的变量+1
      console.log(resp)
      console.log(i);
      //这里可能有BUG，失败也会执行这里,所以这里应该是后台返回过来的状态码为成功时，这里的success才+1
    },
    fail: (res) => {
      fail++;//图片上传失败，图片上传失败的变量+1
      console.log('fail:' + i + "fail:" + fail);
    },
    complete: () => {
      console.log(i);
      i++;//这个图片执行完上传后，开始上传下一张
      if (i == data.path.length) {   //当图片传完时，停止调用          
        console.log('执行完毕');
        console.log('成功：' + success + " 失败：" + fail);
      } else {//若图片还没有传完，则继续调用函数
        console.log(i);
        data.i = i;
        data.success = success;
        data.fail = fail;
        that.uploadimg(data);
      }

    }
  });
}

function setStorageSync(key,value){
  try{
    wx.setStorageSync(key, value);
  } catch(e){
    return e;
  }
}

function getStorageSync(key) {
  try{
    var value = wx.getStorageSync(key)
  } catch (e) {
    return e;
  }
  return value;
}

function removeStorageSync(key){
  try{
    wx.removeStorageSync(key)
  }catch(e){

  }
  
}

function clearStorage(){
  wx.clearStorage()
}

function isLogin(isPush){

  if(getApp().data.uid){

    return true

  } else if (isPush){

    wx.navigateTo({
      url: '/pages/login/login',
    })

  }
  return false
}

//倒计时
function timeout(time,callback){
  var that = this
  time = time - 1
  setTimeout(function () {
    
    callback(time)
    if (time > 0) {
      that.timeout(time, callback);
    }

  }, 1000);
}

function arrayContainItem(arr,item){

  for (var i = 0; i < arr.length;i++){

    if (arr[i] == item){
      return true
    }
  }

  return false
}

module.exports = {
  getCurrentTimeStamp: getCurrentTimeStamp,
  getTimeStamp: getTimeStamp,
  getTime: getTime,
  formatLocation: formatLocation,
  toast: toast,
  http_get: http_get,
  http_post: http_post,
  http_uploadFile: http_uploadFile,
  json2Form: json2Form,
  alert: alert,
  tishi: tishi,
  validate_phone: validate_phone,
  validate_number: validate_number,
  validate_email: validate_email,
  validate_pwd: validate_pwd,
  cameraSheet: cameraSheet,
  setStorageSync: setStorageSync,
  getStorageSync: getStorageSync,
  removeStorageSync: removeStorageSync,
  clearStorage: clearStorage,
  isLogin: isLogin,
  timeout: timeout,
  arrayContainItem: arrayContainItem
}


/*
 JSON.stringify(jsObj);  对象转字符串
 JSON.parse(str);  字符串转对象
*/