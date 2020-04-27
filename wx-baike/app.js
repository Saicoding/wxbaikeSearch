//app.js
App({
  onLaunch: function() {
    let self = this;

    wx.getSystemInfo({ //得到窗口高度,这里必须要用到异步,而且要等到窗口bar显示后再去获取,所以要在onReady周期函数中使用获取窗口高度方法
      success: function (res) { //转换窗口高度
        let windowHeight = res.windowHeight;

        self.globalData.windowHeightPx = windowHeight; //单位px
        let windowWidth = res.windowWidth;
        let platform = res.platform;
        //最上面标题栏不同机型的高度不一样(单位PX)

        let jiaonang = wx.getMenuButtonBoundingClientRect(); //胶囊位置及尺寸

        jiaonang.top = jiaonang.top ? jiaonang.top : 50;
        jiaonang.height = jiaonang.height ? jiaonang.height : 32;
        jiaonang.width = jiaonang.width ? jiaonang.width : 80;

        windowHeight = (windowHeight * (750 / windowWidth));

        self.globalData.windowWidth = windowWidth;//单位px
        self.globalData.windowHeight = windowHeight;//单位rpx
        self.globalData.jiaonang = jiaonang; //胶囊对象
        self.globalData.platform = platform;//平台
      }
    });
  },

  request: function(obj) {
    let self = this;

    let api = self.globalData.api;
    let url = obj.url[0] == '/' ? api + obj.url : api + '/' + obj.url; //判断url最前面有没有/,没有就加上
    let data = obj.data;

    let reqData = {};
    let Where = "WHERE ";

    if(obj.search){ //如果是搜索
      // 处理where字符串
      if (data.WhereObj) {
        if (data.WhereObj.StartDate) {
          Where = Where != 'WHERE ' ? Where + " and " : Where;
          Where = Where + "STR_TO_DATE(ctime, '%Y-%m-%d %H:%i') > STR_TO_DATE('" + data.WhereObj.StartDate + "', '%Y-%m-%d %H:%i')";
        }

        if (data.WhereObj.EndDate) {
          Where = Where != 'WHERE ' ? Where + " and " : Where;
          Where = Where + "STR_TO_DATE(ctime, '%Y-%m-%d %H:%i') < STR_TO_DATE('" + data.WhereObj.EndDate + "', '%Y-%m-%d %H:%i')";
        }

        if (data.WhereObj.Edit_num) {
          Where = Where != 'WHERE ' ? Where + " and " : Where;
          Where = Where + "edit_num >=" + data.WhereObj.Edit_num;
        }

        // 词条类别
        if (data.WhereObj.Type) {
          let filterStr = data.WhereObj.Type.join('|');
          Where = Where != 'WHERE ' ? Where + " and " : Where;
          Where = Where + "flag regexp '" + filterStr + "'"
        }

        // 词条名称过滤
        if (data.WhereObj.NameFilter) {
          let filterStr = data.WhereObj.NameFilter.join('|');
          Where = Where != 'WHERE ' ? Where + " and " : Where;
          Where = Where + "name regexp '" + filterStr + "'"
        }

        // 词条名称屏蔽
        if (data.WhereObj.NameBan) {
          let filterStr = data.WhereObj.NameBan.join('|');
          Where = Where != 'WHERE ' ? Where + " and " : Where;
          Where = Where + "name not regexp '" + filterStr + "'"
        }

        // 创建用户过滤
        if (data.WhereObj.UserFilter) {
          let filterStr = data.WhereObj.UserFilter.join('|');
          Where = Where != 'WHERE ' ? Where + " and " : Where;
          Where = Where + "cname regexp '" + filterStr + "'"
        }

        // 创建用户屏蔽
        if (data.WhereObj.UserBan) {
          let filterStr = data.WhereObj.UserBan.join('|');
          Where = Where != 'WHERE ' ? Where + " and " : Where;
          Where = Where + "cname not regexp '" + filterStr + "'"
        }

        // 参考资料过滤
        if (data.WhereObj.ReferFilter) {
          let filterStr = data.WhereObj.ReferFilter.join('|');
          Where = Where != 'WHERE ' ? Where + " and " : Where;
          Where = Where + "refer regexp '" + filterStr + "'"
        }

        // 参考资料屏蔽
        if (data.WhereObj.ReferBan) {
          let filterStr = data.WhereObj.ReferBan.join('|');
          Where = Where != 'WHERE ' ? Where + " and " : Where;
          Where = Where + "refer not regexp '" + filterStr + "'"
        }

        // 修改原因过滤
        if (data.WhereObj.ReasonFilter) {
          let filterStr = data.WhereObj.ReasonFilter.join('|');
          Where = Where != 'WHERE ' ? Where + " and " : Where;
          Where = Where + "ereson regexp '" + filterStr + "'"
        }

        // 修改原因屏蔽
        if (data.WhereObj.ReasonBan) {
          let filterStr = data.WhereObj.ReasonBan.join('|');
          Where = Where != 'WHERE ' ? Where + " and " : Where;
          Where = Where + "ereson not regexp '" + filterStr + "'"
        }
      }

      reqData.PageIndex = data.PageIndex;
      reqData.PageSize = data.PageSize;
      reqData.Where = Where;
    }

    let header = {
      'content-type': 'application/x-www-form-urlencoded'
    }

    if(obj.test){
      console.log('********************请求的参数*********************')
      if(obj.search){
        console.log(reqData)
      }else{
        console.log(data)
      }
    }

    let promise = new Promise((resolve, reject) => {


      //网络请求
      wx.request({
        url,
        data: obj.search?reqData:data,
        method: obj.method ? obj.method :'post',
        header,
        success: function(res) { //服务器返回数据
          resolve(res.data)
        }
      })
    });
    return promise;
  },

  // 获取openid
  getOpendID: function () {
    let self = this;
    return new Promise((resolve, reject) => {
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          self.request({
            url: "/wxlogin.php",
            data: {
              code: res.code,
            },
            method: 'post',
          }).then(res2 => {
            resolve(res2)
          })
        },
      })
    })
  },

  globalData: {
    userInfo: null,
    time:0,
    view:true,
    api: 'https://www.toyer.club/api/baike'
  }
})