//index.js
//获取应用实例
const app = getApp()
let utils = require('../../utils/util.js');


const STARTTIME = '2019-10-01'; //默认最大可选起始时间
const ENDTIME = utils.getCurrentDate();


Page({
  data: {
    params:{
      PageIndex: 0,
      PageSize: 30
    },
    num_array:[
      1,2,3,4,5,6,7,8,9,10
    ]
  },
 
  onLoad: function () {
    let self = this;
    let params = this.data.params;

    wx.showLoading({
      title:'载入中',
      icon:'none'
    })

    let startValue = wx.getStorageSync('startValue'); //获取当前缓存信息
    let endValue = wx.getStorageSync('endValue');
    let edit_value = wx.getStorageSync('edit_value');

    startValue = startValue ? startValue : STARTTIME;//最小查询时间
    endValue = endValue ? endValue : ENDTIME; //最大查询时间
    edit_value= edit_value? edit_value*1: 0; //最小编辑次数

    params.WhereObj = {
      StartDate: startValue,
      EndDate: endValue
    }

    if(edit_value*1 > 0){//说明有设置编辑次数
      params.WhereObj.Edit_num = edit_value*1+1;
    }


    this.setData({
      STARTTIME,
      ENDTIME,
      startValue,
      endValue,
      params,
      edit_value
    })

    this.search(params);

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
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh:function(){
    // 当前的请求参数
    let params = this.data.params;

    //初始化页码信息
    params.PageIndex = 0;

    this.search(params,true);
  },

  /**
   * 搜索
   */
  search:function(params,fresh){
    let self = this;
    let viewIdArray = wx.getStorageSync('viewIDs'); //本地所有已看过ID数组

    //设置是否正在载入，现在同时请求

    params.PageIndex +=1;

    if (this.data.loading) return;

    this.setData({
      loading:true
    })

    app.request({
      data: params
    }).then(res => {
      console.log(res)
      // 新请求的列表
      let newList = res.Data;

      // 是否有更多
      let hasNoMore = newList.length == 0;

      // 当前列表
      let currentList = self.data.list || [];

      //如果是刷新，就置空原来的列表
      if(fresh){
        currentList = [];
      }

      // 连接两个列表
      let list = currentList.concat(newList);
 

      list.map(item=>{
        item.shortTime = item.ctime.substring(5,16);

        item.view = viewIdArray.indexOf(item.num*1) != -1
      })

      self.setData({
        list,
        hasNoMore,
        params,
        loading:false
      })

      wx.stopPullDownRefresh();
      wx.hideLoading()
    })
  },

  /**
   * 改变日期事件
   */
  startDateChange:function(e){
    let value = e.detail.value;
    let params = this.data.params;

    let StartDate = value+' 00:00:00'


    params.PageIndex = 0;  

    params.WhereObj.StartDate = StartDate;

    this.setData({
      startValue:value
    },()=>{
      wx.setStorage({
        key: 'startValue',
        data: value,
      })
    })

    wx.showLoading({
      title: '载入中',
      icon:'none'
    })

    this.search(params,true)
  },

  endDateChange:function(e){
    let value = e.detail.value;
    let params = this.data.params;

    let EndDate = value + ' 00:00:00'

    params.PageIndex = 0;

    params.WhereObj.EndDate = EndDate;

    this.setData({
      endValue: value
    }, () => {
      wx.setStorage({
        key: 'endValue',
        data: value,
      })
    })

    wx.showLoading({
      title: '载入中',
      icon: 'none'
    })

    this.search(params, true)
  },

  /**
   * 编辑次数改变事件
   */
  editNumChange:function(e){
    let value = e.detail.value;
    let params = this.data.params;

    params.PageIndex = 0;  
    params.WhereObj.Edit_num = value*1 + 1;

    this.setData({
      edit_value:value
    },()=>{
      wx.setStorage({
        key: 'edit_value',
        data: value,
      })
    })

    this.search(params, true)
    
  },

  /**
   * 上拉加载事件
   */
  onReachBottom: function () {
    let params = this.data.params;

    if (this.data.hasNoMore) return;

    this.search(params);
  },

  /**
   * 显示弹窗
   */
  showLayer:function(e){
    let list = this.data.list;
    let index = e.currentTarget.dataset.index;
    let num = e.currentTarget.dataset.num;
    // 点击的对象
    let item = list[index];
    item.view = true;
    

    this.setData({
      item,
      list,
      showLayer:true
    })

    // 加入已看过的id数组

    wx.getStorage({
      key: 'viewIDs',
      success: function(res) {
        let viewIdArray = res.data ? res.data:[];

        if (viewIdArray.indexOf(num*1) ==-1){
          viewIdArray.push(num*1)
          wx.setStorage({
            key: 'viewIDs',
            data: viewIdArray,
          })
        }
      },
      fail:function(){
        console.log('ok')
        wx.setStorage({
          key: 'viewIDs',
          data: [num * 1],
        })
      }
    })
  },

  /**
   * 分享事件
   */
  onShareAppMessage:function(){

  }

})
