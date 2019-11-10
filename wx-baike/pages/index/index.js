//index.js
//获取应用实例
const app = getApp()
let utils = require('../../utils/util.js');


const STARTTIME = '2019-10-01'; //默认最大可选起始时间
const ENDTIME = utils.getCurrentDate();


Page({
  data: {
    params: {
      PageIndex: 0,
      PageSize: 30
    },
    num_array: [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10
    ],

    // 目录
    bars: [{
        title: '创建时间'
      },
      {
        title: '词条类型'
      },
      {
        title: '词条名称'
      },
      {
        title: '创建用户'
      },
      {
        title: '参考资料'
      },
      {
        title: '修改原因'
      }
    ],

    filterBars: [{
        index: 2,
        prompt: '过滤词条名称,可添加过滤列表和屏蔽列表',
        filterList: [],
        banList: []
      },
      {
        index: 3,
        prompt: '过滤创建用户名称,可添加过滤列表和屏蔽列表',
        filterList: [],
        banList: []
      },
      {
        index: 4,
        prompt: '过滤参考资料名称,可添加过滤列表和屏蔽列表',
        filterList: [],
        banList: []
      },
      {
        index: 5,
        prompt: '过滤修改原因,可添加过滤列表和屏蔽列表',
        filterList: [],
        banList: []
      },
    ]

  },

  onLoad: function() {
    let self = this;
    let params = this.data.params; //请求参数
    let flags = utils.flags
    let filterBars = this.data.filterBars;


    wx.showLoading({
      title: '载入中',
      icon: 'none'
    })

    let startValue = wx.getStorageSync('startValue'); //获取当前缓存信息
    let endValue = wx.getStorageSync('endValue');
    let edit_value = wx.getStorageSync('edit_value');
    let EntryType = wx.getStorageSync('EntryType');
    let nameKeys = wx.getStorageSync('nameKeys') || {}; //词条名称过滤列表
    let userKeys = wx.getStorageSync('userKeys') || {}; //词条名称过滤列表
    let referKeys = wx.getStorageSync('referKeys') || {}; //词条名称过滤列表
    let reasonKeys = wx.getStorageSync('reasonKeys') || {}; //词条名称过滤列表

    filterBars[0].filterList = nameKeys.Filter || [];
    filterBars[0].filterList.map(item => {
      item.selected = false;
    })
    filterBars[0].banList = nameKeys.Ban || [];
    filterBars[0].banList.map(item => {
      item.selected = false;
    })

    filterBars[1].filterList = userKeys.Filter || [];
    filterBars[1].filterList.map(item => {
      item.selected = false;
    })

    filterBars[1].banList = userKeys.Ban || [];
    filterBars[1].banList.map(item => {
      item.selected = false;
    })


    filterBars[2].filterList = referKeys.Filter || [];
    filterBars[2].filterList.map(item => {
      item.selected = false;
    })
    filterBars[2].banList = referKeys.Ban || [];
    filterBars[2].banList.map(item => {
      item.selected = false;
    })

    filterBars[3].filterList = reasonKeys.Filter || [];
    filterBars[3].filterList.map(item => {
      item.selected = false;
    })
    filterBars[3].banList = reasonKeys.Ban || [];
    filterBars[3].banList.map(item => {
      item.selected = false;
    })






    startValue = startValue ? startValue : STARTTIME; //最小查询时间
    endValue = endValue ? endValue : ENDTIME; //最大查询时间
    edit_value = edit_value ? edit_value * 1 : 0; //最小编辑次数

    params.WhereObj = {
      StartDate: startValue,
      EndDate: endValue
    }

    utils.setTypeSelect(flags, EntryType, params)

    if (edit_value * 1 > 0) { //说明有设置编辑次数
      params.WhereObj.Edit_num = edit_value * 1 + 1;
    }

    this.setData({
      STARTTIME,
      ENDTIME,
      startValue,
      endValue,
      params,
      flags,
      edit_value,
      filterBars
    })

    this.search(params);

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

  /**
   * 生命周期事件
   */
  onShow: function() {
    if (app.globalData.clear) { //清除所有收藏和浏览信息
      app.globalData.clear = false;
      // 当前的请求参数
      let params = this.data.params;

      //初始化页码信息
      params.PageIndex = 0;

      this.search(params, true);
    }


    if (app.globalData.clearAll) { //清除所有收藏和浏览信息
      app.globalData.clearAll = false;
      // 当前的请求参数
      let params = this.data.params;
      let filterBars = this.data.filterBars;

      //初始化页码信息
      params.PageIndex = 0;

      params.WhereObj = {};

      params.WhereObj.EndDate = ENDTIME;
      params.WhereObj.StartDate = STARTTIME;

      for (let i = 0; i < filterBars.length; i++) {
        filterBars[i].filterList = [];
        filterBars[i].banList = [];
      }

      this.setData({
        filterBars
      }, () => {
        this.search(params, true);
      })
    }
  },

  onPullDownRefresh:function(){
    let self = this;

    wx.showNavigationBarLoading()
    wx.startPullDownRefresh({
      
    })

    app.request({
      data: {
        PageIndex: 1,
        PageSize: 100,
      }
    }).then(res => {
      let list = res.data.Data;
      self.setData({
        list
      })

      wx.hideNavigationBarLoading()

       wx.stopPullDownRefresh()
    })
  },

  /**
   * 导航到百科页面
   */
  GOurl: function(e) {
    let res = e.currentTarget.dataset;
    let name = res.name;
    let num = res.num;
    let index = res.index;

    let list = this.data.list;

    // 点击的对象
    let item = list[index];
    item.view = true;

    this.setData({
      list
    })

    let url = 'https://baike.baidu.com/item/' + name + '/' + num;

    wx.navigateTo({
      url: '/pages/web-view/web-view?src=' + url,
    })

    // 加入已看过的id数组
    this.setLocal('viewIDs', num);
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh: function() {
    // 当前的请求参数
    let params = this.data.params;

    //初始化页码信息
    params.PageIndex = 0;

    this.search(params, true);
  },

  /**
   * 搜索
   */
  search: function(params, fresh) {
    let self = this;
    let viewIdArray = wx.getStorageSync('viewIDs'); //本地所有已看过ID数组
    let markIdArray = wx.getStorageSync('markIDs'); //已收藏的本地ID数组

    //设置是否正在载入，现在同时请求

    params.PageIndex += 1;

    if (this.data.loading) return;

    this.setData({
      loading: true
    })

    app.request({
      data: params,
      test: true,
    }).then(res => {
      // 新请求的列表
      let newList = res.Data;

      // 是否有更多
      let hasNoMore = newList.length == 0;

      // 当前列表
      let currentList = self.data.list || [];

      //如果是刷新，就置空原来的列表
      if (fresh) {
        currentList = [];
      }


      newList.map(item => {
        item.shortTime = item.ctime.substring(5, 16);
        item.ctime = item.ctime.slice(0, -3);
        item.etime = item.etime.slice(0, -3);
        item.view = viewIdArray.indexOf(item.num * 1) != -1;
        item.mark = markIdArray.indexOf(item.num * 1) != -1;
        item.refer = item.refer.substring(1);
        item.referDate = item.referDate.substring(5, item.referDate.lastIndexOf(']'))
      })

      // 连接两个列表
      let list = currentList.concat(newList);

      self.setData({
        list,
        hasNoMore,
        params,
        loading: false
      })

      wx.stopPullDownRefresh();
      wx.hideLoading()
    })
  },

  /**
   * 改变日期事件
   */
  startDateChange: function(e) {
    let value = e.detail.value;
    let params = this.data.params;

    let StartDate = value + ' 00:00:00'


    params.PageIndex = 0;

    params.WhereObj.StartDate = StartDate;

    this.setData({
      startValue: value
    }, () => {
      wx.setStorage({
        key: 'startValue',
        data: value,
      })
    })

    wx.showLoading({
      title: '载入中',
      icon: 'none'
    })

    this.search(params, true)
  },

  endDateChange: function(e) {
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
  editNumChange: function(e) {
    let value = e.detail.value;
    let params = this.data.params;

    params.PageIndex = 0;
    params.WhereObj.Edit_num = value * 1 + 1;

    this.setData({
      edit_value: value
    }, () => {
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
  onReachBottom: function() {
    let params = this.data.params;

    if (this.data.hasNoMore) return;

    this.search(params);
  },

  /**
   * 切换标记
   */
  toogleMark: function(e) {
    let list = this.data.list;
    let index = e.currentTarget.dataset.index;
    let num = e.currentTarget.dataset.num;

    // 点击的对象
    let item = list[index];
    item.mark = !item.mark;

    // 加入已看过的id数组
    this.setLocal('markIDs', num, true, item.mark);

    this.setData({
      list
    })
  },

  /**
   * 展示弹窗
   */
  showLayer: function(e) {
    let list = this.data.list;
    let index = e.currentTarget.dataset.index;
    let num = e.currentTarget.dataset.num;
    // 点击的对象
    let item = list[index];
    item.view = true;


    this.setData({
      list,
      item,
      showLayer: true
    })

    // 加入已看过的id数组
    this.setLocal('viewIDs', num);
  },

  /**
   * 设置本地缓存
   * key:本地缓存的key值
   * isMark：是不是收藏
   * itemMark:如果是收藏，收藏状态
   */
  setLocal: function(key, num, isMark, itemMark) {
    // 加入已看过的id数组
    wx.getStorage({
      key,
      success: function(res) {
        let IdArray = res.data ? res.data : [];

        if (isMark) {
          //如果本地数组不包含此ID，就加入ID数组
          if (IdArray.indexOf(num * 1) == -1) {
            IdArray.push(num * 1)
          } else if (IdArray.indexOf(num * 1) != -1 && !itemMark) { //如果在本地收藏ID数组里面，而且取消了收藏，那就移除
            IdArray.splice(IdArray.indexOf(num * 1), 1); //移除这个元素
          }
        } else {
          if (IdArray.indexOf(num * 1) == -1) {
            IdArray.push(num * 1)
          }
        }

        wx.setStorage({
          key,
          data: IdArray,
        })
      },
      fail: function() {
        wx.setStorage({
          key,
          data: [num * 1],
        })
      }
    })
  },

  /**
   * 切换显示过滤条件
   */
  toogleShowBar: function(e) {
    let index = e.currentTarget.dataset.index;
    let cindex = e.currentTarget.dataset.cindex;
    let bars = this.data.bars;
    // bars[index].show = !bars[index].show

    bars.map((item, i) => {
      if (index == i) {
        item.show = !bars[index].show
        if (item.show) {
          this.setData({
            currentIndex: cindex
          })
        }
      } else {
        item.show = false;
      }
    })

    this.setData({
      bars
    })
  },

  /**
   * 选择词条类型事件
   */
  selectType: function(e) {
    let res = e.currentTarget.dataset;
    let flags = this.data.flags; //当前标签列表
    let index = res.index;
    let iindex = res.iindex;

    for (let i = 0; i < flags.length; i++) {
      let item = flags[i];

      if (index == i) {
        if (iindex == 0) { //选择了不限,把所有已选择取消
          if (!flags[index].items[0].selected) { //如果当前类别不限是选中状态
            flags[index].items[0].selected = true;
            for (let j = 1; j < item.items.length; j++) {
              flags[index].items[j].selected = false;
            }
          } else {
            flags[index].items[0].selected = false;
          }
          this.setData({
            flags
          })
        } else { //没有选择不限
          for (let j = 0; j < item.items.length; j++) {
            if (iindex == j) {
              flags[index].items[j].selected = !flags[index].items[j].selected;
              flags[index].items[0].selected = false;
              this.setData({
                flags
              })
            }
          }
        }
      }
    }
  },

  /**
   * 重置词条类型
   */
  resetType: function() {
    let flags = this.data.flags;

    for (let i = 0; i < flags.length; i++) {
      let item = flags[i];
      for (let j = 0; j < item.items.length; j++) {
        item.items[j].selected = false;
      }
    }

    this.setData({
      flags
    })
  },

  /**
   * 确认选择词条类型
   */
  confirmType: function() {
    let self = this;

    let params = this.data.params;
    let bars = self.data.bars; //目录信息
    let flags = self.data.flags; //当前所有类型

    let selFlagArr = []; //选中的类型数组

    for (let i = 0; i < flags.length; i++) {
      let flag = flags[i].items;

      for (let j = 0; j < flag.length; j++) {
        if (flag[j].selected) {
          if (flag[j].Text == '不限') { //如果是不限，就把所有关键词添加进去
            for (let k = 1; k < flag.length; k++) {
              selFlagArr.push(flag[k].Text)
            }
          } else {
            selFlagArr.push(flag[j].Text)
          }
        }
      }
    }

    // 隐藏弹框
    bars[1].show = false;

    this.setData({
      bars
    })

    wx.showLoading({
      title: '请求中',
      icon: 'none'
    })

    // 页码设置为0
    params.PageIndex = 0;

    if (selFlagArr.length > 0) {
      params.WhereObj.Type = selFlagArr
    } else {
      params.WhereObj.Type = false;
    }

    this.search(params, true);

    wx.setStorage({
      key: 'EntryType',
      data: selFlagArr,
    })
  },

  /**
   * 过滤列表输入事件
   */
  FilterInput: function(e) {
    let filterBars = this.data.filterBars;
    let currentIndex = this.data.currentIndex;

    filterBars[currentIndex].FilterText = e.detail.value;

    this.setData({
      filterBars
    })
  },

  /**
   * 禁用名单输入时，取消过滤列表的选择
   */
  BanInput: function(e) {
    let filterBars = this.data.filterBars;
    let currentIndex = this.data.currentIndex;
    filterBars[currentIndex].BanText = e.detail.value;

    this.setData({
      filterBars
    })
  },

  FilterAdd: function() {
    let filterBars = this.data.filterBars;
    let currentIndex = this.data.currentIndex;

    let banList = filterBars[currentIndex].banList;
    let filterList = filterBars[currentIndex].filterList;
    let isExist = false //是否存在

    // 如果输入内容为空就返回
    if (!filterBars[currentIndex].FilterText) return;

    filterList.map(item => {
      if (item.Text == filterBars[currentIndex].FilterText) {
        isExist = true
      }
    })

    if (filterBars[currentIndex].FilterText.length > 5) {
      wx.showToast({
        title: '关键字最多为5个字符',
        icon: 'none',
        duration: 4000
      })
      return
    } else if (isExist) {
      filterBars[currentIndex].FilterText = ""
      this.setData({
        filterBars
      })
      wx.showToast({
        title: '已有该关键词，请勿重复添加',
        icon: 'none',
        duration: 4000
      })
      return
    } else {
      let obj = {};
      obj.Text = filterBars[currentIndex].FilterText;
      obj.selected = true
      filterList.push(obj);

      filterBars[currentIndex].FilterText = ""

      for (let i = 0; i < filterBars[currentIndex].banList.length; i++) {
        filterBars[currentIndex].banList[i].selected = false;
      }

      this.setData({
        filterBars
      })
    }
  },

  BanAdd: function() {
    let filterBars = this.data.filterBars;
    let currentIndex = this.data.currentIndex;

    let banList = filterBars[currentIndex].banList;
    let filterList = filterBars[currentIndex].filterList;
    let isExist = false //是否存在

    // 如果输入内容为空就返回
    if (!filterBars[currentIndex].BanText) return;

    banList.map(item => {
      if (item.Text == filterBars[currentIndex].BanText) {
        isExist = true
      }
    })

    if (filterBars[currentIndex].BanText.length > 5) {
      wx.showToast({
        title: '关键字最多为5个字符',
        icon: 'none',
        duration: 4000
      })
      return
    } else if (isExist) {
      filterBars[currentIndex].BanText = ""
      this.setData({
        filterBars
      })
      wx.showToast({
        title: '已有该关键词，请勿重复添加',
        icon: 'none',
        duration: 4000
      })
      return
    } else {
      let obj = {};
      obj.Text = filterBars[currentIndex].BanText;
      obj.selected = true
      banList.push(obj);

      filterBars[currentIndex].BanText = ""

      console.log(filterBars)

      for (let i = 0; i < filterBars[currentIndex].filterList.length; i++) {
        filterBars[currentIndex].filterList[i].selected = false;
      }

      this.setData({
        filterBars
      })
    }
  },

  /**
   * 切换选择名称
   */
  toogleFilterName: function(e) {
    let index = e.currentTarget.dataset.index; //bar索引
    let iindex = e.currentTarget.dataset.iindex; //点击的列表索引
    let filterBars = this.data.filterBars; //所有同类数组

    let filterList = filterBars[index].filterList; //过滤列表
    let banList = filterBars[index].banList; //屏蔽列表

    filterList[iindex].selected = !filterList[iindex].selected;

    if (filterList[iindex].selected) { //如果选中了，就取消屏蔽列表的选择状态
      banList.map(item => {
        item.selected = false
      })
    }


    this.setData({
      filterBars
    })
  },

  toogleBanName: function(e) {
    let index = e.currentTarget.dataset.index; //bar索引
    let iindex = e.currentTarget.dataset.iindex; //点击的列表索引
    let filterBars = this.data.filterBars; //所有同类数组

    let filterList = filterBars[index].filterList; //过滤列表
    let banList = filterBars[index].banList; //屏蔽列表

    banList[iindex].selected = !banList[iindex].selected;

    if (banList[iindex].selected) { //如果选中了，就取消屏蔽列表的选择状态
      filterList.map(item => {
        item.selected = false
      })
    }

    this.setData({
      filterBars
    })
  },

  /**
   * 重置选择状态
   */
  resetFilter: function(e) {
    let self = this;
    let index = e.currentTarget.dataset.index;
    let filterBars = this.data.filterBars;

    let BanList = filterBars[index].banList;
    let FilterList = filterBars[index].filterList;

    wx.showModal({
      content: '选择重置选择状态还是删除所有关键词',
      confirmText: '删除',
      cancelText: '重置',
      confirmColor: '#0096fa',
      success: (e) => {
        if (e.confirm) { //删除所有
          BanList = [];
          FilterList = [];

          self.setData({
            filterBars
          })
        } else if (e.cancel) {
          BanList.map(item => {
            item.selected = false
          })

          FilterList.map(item => {
            item.selected = false
          })

          this.setData({
            filterBars
          })
        }
      }
    })
  },


  /**
   * 删除词条名称过滤列表
   */
  deleteNameWord: function(e) {
    let res = e.currentTarget.dataset;
    let index = res.index; //bar索引
    let iindex = res.iindex; //点击的列表索引
    let type = res.type;

    let filterBars = this.data.filterBars; //所有同类数组

    if (type == 'filter') { //如果是过滤模式
      filterBars[index].filterList.splice(iindex, 1)
    } else if (type == "ban") {
      filterBars[index].banList.splice(iindex, 1)
    }
    this.setData({
      filterBars
    })
  },

  /**
   * 点击确定过滤词条名称
   */
  confirmFilter: function(e) {
    let self = this;
    let index = e.currentTarget.dataset.index;
    let filterBars = this.data.filterBars;


    let bars = this.data.bars;
    bars[index + 2].show = false;

    this.setData({
      bars
    })

    let params = this.data.params
    let FilterList = filterBars[index].filterList || [];
    let BanList = filterBars[index].banList || [];


    let selectedFilterList = []; //已选中的过滤列表
    let selectedBanList = []; //已选中的屏蔽列表

    FilterList.map(item => {
      if (item.selected) {
        selectedFilterList.push(item.Text)
      }
    })

    BanList.map(item => {
      if (item.selected) {
        selectedBanList.push(item.Text)
      }
    })

    if (selectedFilterList.length == 0 && selectedBanList.length == 0) { //没有选择任何关键词
      switch (index) {
        case 0: // 词条名称
          params.WhereObj.NameFilter = false;
          params.WhereObj.NameBan = false;
          break;
        case 1: //创建用户
          params.WhereObj.UserFilter = false;
          params.WhereObj.UserBan = false;
          break;
        case 2: //参考资料
          params.WhereObj.ReferFilter = false;
          params.WhereObj.ReferBan = false;
          break;
        case 3: //修改原因
          params.WhereObj.ReasonFilter = false;
          params.WhereObj.ReasonBan = false;
          break;
      }
    }

    console.log(selectedFilterList, selectedBanList)

    if (selectedFilterList.length > 0) {
      switch (index) {
        case 0: // 词条名称
          params.WhereObj.NameFilter = selectedFilterList;
          params.WhereObj.NameBan = false;
          break;
        case 1: //创建用户
          params.WhereObj.UserFilter = selectedFilterList;
          params.WhereObj.UserBan = false;
          break;
        case 2: //参考资料
          params.WhereObj.ReferFilter = selectedFilterList;
          params.WhereObj.ReferBan = false;
          break;
        case 3: //修改原因
          params.WhereObj.ReasonFilter = selectedFilterList;
          params.WhereObj.ReasonBan = false;
          break;
      }
    }

    if (selectedBanList.length > 0) {
      switch (index) {
        case 0: // 词条名称
          params.WhereObj.NameBan = selectedBanList;
          params.WhereObj.NameFilter = false;
          break;
        case 1: //创建用户
          params.WhereObj.UserBan = selectedBanList;
          params.WhereObj.UserFilter = false;
          break;
        case 2: //参考资料
          params.WhereObj.ReferBan = selectedBanList;
          params.WhereObj.ReferFilter = false;
          break;
        case 3: //修改原因
          params.WhereObj.ReasonBan = selectedBanList;
          params.WhereObj.ReasonFilter = false;
          break;
      }
    }

    console.log(params.WhereObj)

    // 页码设置为0
    params.PageIndex = 0;

    wx.showLoading({
      title: '载入中',
      icon: 'none'
    })

    this.search(params, true)

    let key = '';

    switch (index) {
      case 0:
        key = 'nameKeys';
        break;
      case 1:
        key = 'userKeys';
        break;
      case 2:
        key = 'referKeys';
        break;
      case 3:
        key = 'reasonKeys';
        break;
    }
    wx.setStorage({
      key,
      data: {
        Filter: FilterList,
        Ban: BanList
      },
    })
  },

  /**
   * 阻止冒泡
   */
  undo: function() {

    return false;
  },

  /**
   * 分享事件
   */
  onShareAppMessage: function() {

  }

})