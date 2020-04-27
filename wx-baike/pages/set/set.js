// pages/set/set.js
const app = getApp();
let common = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight:app.globalData.windowHeight,
    windowWidth:app.globalData.windowWidth,
    jiaonang:app.globalData.jiaonang,
    clearType: 1
  },

  /**
   * 生命周期事件
   */
  onLoad: function() {

  },

  Subscribe:function(e){

    wx.requestSubscribeMessage({
      tmplIds: ['cghFs7Vc5etuAGpDsWLHs2coRiqbWmprV5AnrCLt5iU'],
      success: res => {
        console.log(res)
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },

  /**
   * 生命周期事件
   */
  onReady: function() {
    let self = this;

    wx.getSystemInfo({ //得到窗口高度,这里必须要用到异步,而且要等到窗口bar显示后再去获取,所以要在onReady周期函数中使用获取窗口高度方法
      success: function(res) { //转换窗口高度
        let windowHeight = res.windowHeight;
        let windowWidth = res.windowWidth;
        //最上面标题栏不同机型的高度不一样(单位PX

        windowHeight = (windowHeight * (750 / windowWidth));

        self.setData({
          windowWidth,
          windowHeight
        })
      }
    });
  },

  onShow: function() {
    let self = this;

    let user = wx.getStorageSync('user');

    console.log(user);

    user.canview = app.globalData.canview;

    if (app.globalData.openid){
      console.log('haha')
      app.request({
        url: 'getView.php',
        method: 'post',
        data: {
          openid: app.globalData.openid
        },
        self,
      }).then(res => {
        if (res.Data == '注册') { // 第一次访问
          app.globalData.hasview = 0; //已经访问时间
          app.globalData.canview = 300; //可以访问时间
          user.hasview = 0;
          user.canview = 300;

        } else { // 登录过
          app.globalData.hasview = res.Data[0].hasview * 1; //已经访问时间
          app.globalData.canview = res.Data[0].canview * 1;
          user.hasview = res.Data[0].hasview * 1;
          user.canview = res.Data[0].canview * 1;

          wx.setStorageSync('user', user)
        }

        self.setData({
          user
        })

      })
    }



    
    if(user && !this.data.interval){
      console.log('启动定时器')
      let interval = setInterval(()=>{
        user.hasview = app.globalData.hasview;
        user.canview = app.globalData.canview;
        this.setData({
          user
        })
        wx.setStorage({
          key: 'user',
          data: user,
        })

      },1000)


      this.setData({
        interval
      })
    }

    this.setData({
      user
    })
  },

  /**
   * 清除缓存
   */
  clearStorage: function() {
    let self = this;
    let clearType = this.data.clearType * 1 //当前的清除类型

    if (clearType == 1) { //清除所有已收藏和浏览数据
      wx.removeStorageSync('viewIDs'); //已看ID
      wx.removeStorageSync('markIDs'); //已收藏数据
      app.globalData.clear = true;

      this.setData({
        showClear: false
      }, () => {
        wx.showToast({
          title: '清除成功',
          icon: 'none',
          duration: 3000
        })
      })
    } else { //清除所有过滤条件
      app.globalData.clearAll = true;
      wx.removeStorageSync('startValue'); //获取当前缓存信息
      wx.removeStorageSync('endValue');
      wx.removeStorageSync('edit_value');
      wx.removeStorageSync('EntryType');
      wx.removeStorageSync('nameKeys'); //词条名称过滤列表
      wx.removeStorageSync('userKeys'); //词条名称过滤列表
      wx.removeStorageSync('referKeys'); //词条名称过滤列表
      wx.removeStorageSync('reasonKeys'); //词条名称过滤列表
      this.setData({
        showClear: false
      }, () => {
        wx.showToast({
          title: '清除成功',
          icon: 'none',
          duration: 3000
        })
      })
    }
  },

  /**
   * 切换清除缓存弹窗
   */
  showDialog: function() {
    this.setData({
      showClear: true
    })
  },

  /**
   * 切换清除弹窗
   */
  toogleShowClearDialog: function() {
    this.setData({
      showClear: !this.data.showClear
    })
  },

  undo: function() {
    return
  },

  /**
   * 清除弹窗点击取消
   */
  cancel: function() {
    this.setData({
      showClear: false
    })
  },

  /**
   * 改变清除类型
   */
  changeClearType: function(e) {
    let type = e.currentTarget.dataset.type * 1;
    this.setData({
      clearType: type
    })
  },

  /**
   * 打电话
   */
  contact: function(e) {
    wx.makePhoneCall({
      phoneNumber: '15533548461',
    })
  },

  /**
   * 
   */
  onUnload:function(){
    clearInterval(this.data.interval)
  },

  /**
   * 导航到关于我们
   */
  GOabout: function(e) {
    wx.navigateTo({
      url: '/pages/set/about/about',
    })
  },

  /**
   * 获取手机号
   */
  wxLogin: function(e) {
    let self = this;
    let userInfo = e.detail.userInfo;
    let user = {};
    user.Name = userInfo.nickName; //昵称
    user.sex = userInfo.gender; //性别
    user.avatarUrl = userInfo.avatarUrl; //头像
    user.openid = app.globalData.openid; //openid
    user.city = userInfo.city; //城市0
    user.province = userInfo.province; //省份

    wx.showLoading({
      title: '载入中',
    })

    app.request({
      url: 'getView.php',
      method: 'post',
      data: {
        openid: app.globalData.openid,
        name: userInfo.nickName || '未命名',
        sex: userInfo.gender,
        avatar: userInfo.avatarUrl,
        city: userInfo.city,
        province: userInfo.province
      }
    }).then(res => {
      let result = res.Data;

      wx.hideLoading();

      console.log(result)

      if (result == '注册') {
        wx.showToast({
          title: '注册成功',
          icon: 'none',
          duration: 3000
        })
        user.canview = 30;
        user.hasview = 0;
      }else{
        user.canview = result[0].canview
        user.hasview = result[0].hasview
      }

      self.setData({
        user
      })

      wx.setStorage({
        key: 'user',
        data: user,
      })
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})