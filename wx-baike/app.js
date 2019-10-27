//app.js
App({
  onLaunch: function() {

  },

  request: function(obj) {
    let self = this;
    let url = this.globalData.url;
    let data = obj.data;

    if (data.Where){
      let Where = "WHERE ";

      if (data.Where.name){
        let filterStr = data.Where.name.join('|');
        Where = Where + "name regexp '" + filterStr+"'"
      }

      if (data.Where.uname){
        let filterStr = data.Where.uname.join('|');
        Where = Where?Where+" and ":"WHERE ";
        Where = Where + "uname regexp '" + filterStr+"'"
      }

      if (data.Where.reson) {
        let filterStr = data.Where.reson.join('|');
        Where = Where ? Where + " and " : "WHERE ";
        Where = Where + "reson regexp '" + filterStr+"'"
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

    let promise = new Promise((resolve, reject) => {


      //网络请求
      wx.request({
        url,
        data,
        method: obj.method ? obj.method :'post',
        header,
        success: function(res) { //服务器返回数据
          resolve(res)
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