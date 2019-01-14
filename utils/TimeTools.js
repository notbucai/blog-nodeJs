const time2DateStr = function (time) {

  const date = new Date(time);

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  return `${year}年${month}月${day}日`

}


module.exports = {
  time2DateStr
}