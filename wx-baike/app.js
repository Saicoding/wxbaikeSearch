//app.js
App({
  onLaunch: function() {

  },

  request: function(obj) {
    let self = this;
    let url = this.globalData.url;
    let data = obj.data;
    let reqData = {};
    let Where = "WHERE ";

    // 处理where字符串
    if (data.WhereObj){
      if (data.WhereObj.StartDate){
        Where = Where != 'WHERE ' ? Where +" and " : Where;
        Where = Where + "STR_TO_DATE(ctime, '%Y-%m-%d %H:%i') > STR_TO_DATE('" + data.WhereObj.StartDate+"', '%Y-%m-%d %H:%i')";
      }

      if (data.WhereObj.EndDate) {
        Where = Where != 'WHERE ' ? Where +" and " : Where;
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


    let header = {
      'content-type': 'application/x-www-form-urlencoded'
    }

    if(obj.test){
      console.log(reqData)
    }

    let promise = new Promise((resolve, reject) => {


      //网络请求
      wx.request({
        url,
        data: reqData,
        method: obj.method ? obj.method :'post',
        header,
        success: function(res) { //服务器返回数据
          resolve(res.data)
        }
      })
    });
    return promise;
  },
  globalData: {
    userInfo: null,
    url: 'http://45.63.36.93/search.php'
  }
})