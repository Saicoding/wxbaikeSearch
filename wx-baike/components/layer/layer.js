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

    undo:function(){
      return
    }
  }
})
