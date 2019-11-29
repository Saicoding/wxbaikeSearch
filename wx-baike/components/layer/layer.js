// components/layer/layer.js
const app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object,
      value: {}
    },
    windowHeight: {
      type: Number,
      value: 1400
    },
    show: {
      type: Boolean,
      value: false
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
    hide: function() {
      this.setData({
        show: false
      })
    },

    /**
     * 导航到参考资料
     */
    GOurl: function(e) {
      let url = e.currentTarget.dataset.url;

      wx.showLoading({
        title:'获取中',
        icon:'none',
        duration:3000
      })

      app.request({
        url: 'view.php',
        data: {
          url
        },
        method: 'get',
        self,
      }).then(res => {
        wx.hideLoading();
        wx.navigateTo({
          url: '/pages/view/view'
        })
      })
    },

    undo: function() {
      return
    }
  }
})