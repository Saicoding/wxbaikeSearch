// pages/set/set.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    clearType:1
  },

  /**
   * 生命周期事件
   */
  onReady:function(){
    let self = this;

    wx.getSystemInfo({ //得到窗口高度,这里必须要用到异步,而且要等到窗口bar显示后再去获取,所以要在onReady周期函数中使用获取窗口高度方法
      success: function (res) { //转换窗口高度
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

  /**
   * 清除缓存
   */
  clearStorage: function() {
    let self = this;
    let clearType = this.data.clearType * 1 //当前的清除类型
    
    if (clearType == 1){//清除所有已收藏和浏览数据
      wx.removeStorageSync('viewIDs');//已看ID
      wx.removeStorageSync('markIDs');//已收藏数据
      app.globalData.clear = true;

      this.setData({
        showClear: false
      },()=>{
        wx.showToast({
          title: '清除成功',
          icon:'none',
          duration:3000
        })
      })
    }else{ //清除所有过滤条件
      app.globalData.clearAll = true;
      wx.removeStorageSync('startValue'); //获取当前缓存信息
      wx.removeStorageSync('endValue');
      wx.removeStorageSync('edit_value');
      wx.removeStorageSync('EntryType');
      wx.removeStorageSync('nameKeys') ; //词条名称过滤列表
      wx.removeStorageSync('userKeys') ; //词条名称过滤列表
      wx.removeStorageSync('referKeys') ; //词条名称过滤列表
      wx.removeStorageSync('reasonKeys') ; //词条名称过滤列表
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

  undo:function(){
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
  contact:function(e){
    wx.makePhoneCall({
      phoneNumber: '15533548461',
    })
  },

  /**
   * 导航到关于我们
   */
  GOabout:function(e){
    wx.navigateTo({
      url: '/pages/set/about/about',
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})