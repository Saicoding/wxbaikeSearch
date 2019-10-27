//index.js
//获取应用实例
const app = getApp()

Page({
  data: {

  },
 
  onLoad: function () {
    let self = this;

    wx.showLoading({
      title:'载入中',
      icon:'none'
    })

    app.request({
      data:{
        PageIndex:1,
        PageSize:100,
        // Where:{
        //   // name:[]
        // }
      }
    }).then(res=>{
      let list = res.data.Data;
      self.setData({
        list
      })

      wx.hideLoading()
    })
  },

  /**
   * 导航到百科页面
   */
  GOurl:function(e){
    let res = e.currentTarget.dataset;
    let name = res.name;
    let num = res.num;

    let url = 'https://baike.baidu.com/item/'+name+'/'+num;

    wx.navigateTo({
      url:'/pages/web-view/web-view?src='+url,
    })
  }
})
