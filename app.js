//app.js
App({
  onLaunch: function () {
      // 初始化慧眼实名核身组件
      const Verify = require('/verify_mpsdk/main');
     Verify.init();
  },
  globalData: {
    userInfo: null
  },
  Coca: require("utils/Coca.js"), //引入 util 类
  data:{
    domain:"https://changsuo.kaiqun.net/songbeiApi",
    domain1:"https://epidemic.kaiqun.net",
    domain2:'https://healthy.mangocloud.com.cn'
  }
})