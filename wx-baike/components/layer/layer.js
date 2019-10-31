// components/layer/layer.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item:{
      type:Object,
      value:{}
    },
    windowHeight:{
      type:Number,
      value:1400
    },
    show:{
      type:Boolean,
      value:false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    hide:function(){
      this.setData({
        show:false
      })
    },

    /**
     * 导航到参考资料
     */
    GOurl:function(e){
      let url = e.currentTarget.dataset.url;

      wx.navigateTo({
        url:'/pages/web-view/web-view?src='+url
      })
    },

    undo:function(){
      return
    }
  }
})
