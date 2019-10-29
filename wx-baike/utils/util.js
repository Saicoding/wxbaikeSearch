function getCurrentDate(){
  let mydate = new Date();
  let y = mydate.getFullYear();
  let m = mydate.getMonth()+1;
  m = m < 10?'0'+m:m

  let d = mydate.getDate(); //获取当前日(1-31)
  d = d <10?'0'+d:d;

  let date = y+'-'+m+'-'+d;
  return date
}

module.exports = {
  getCurrentDate
}
