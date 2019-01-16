function v_user_arg(key, val) {
  let reg = /^.+$/;
  switch (key) {
    case "u_email":
      reg = /([@]|\%40)[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      break;
    case "u_name":
      reg = /(^.{4,20}$)/;
      errmsg = "长度不能少于4位也不能大于20个字符";
      break;
    case "u_pwd":
      reg = /(^.{6,}$)/;
      errmsg = "长度不能少于6位";
      break;

    default:
      reg = /(^.+$)/;
      errmsg = "不能为空";
      break;
  }
  return reg.test(val);
}

function v_user_args(obj) {

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const val = obj[key];
      if (!v_user_arg(key, val)) {
        return false;
      }
    }
  }

  return true;

}

module.exports = {
  v_user_arg,
  v_user_args
}