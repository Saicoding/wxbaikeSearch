//app.js
App({
  onLaunch: function() {

  },

  request: function(obj) {
    let self = this;
    let url = this.globalData.url;
    let data = obj.data;

    // 处理where字符串
    if (data.WhereObj){
      let Where = "WHERE ";

      if (data.WhereObj.name){
        let filterStr = data.WhereObj.name.join('|');
        Where = Where + "name regexp '" + filterStr+"'"    
      }

      if (data.WhereObj.uname){
        let filterStr = data.WhereObj.uname.join('|');
        Where = Where != 'WHERE ' ? Where+" and " : Where;
        Where = Where + "uname regexp '" + filterStr+"'"
      }

      if (data.WhereObj.reson) {
        let filterStr = data.WhereObj.reson.join('|');
        Where = Where != 'WHERE ' ? Where+" and " : Where;
        Where = Where + "reson regexp '" + filterStr+"'"
      }

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

      data.Where = Where;

      console.log(Where)

    }

    let header = {
      'content-type': 'application/x-www-form-urlencoded'
    }

    if (data == undefined) { //如果没设置data
      data = {};
    }

    if(obj.test){
      console.log(data)
    }

    let promise = new Promise((resolve, reject) => {


      //网络请求
      wx.request({
        url,
        data,
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