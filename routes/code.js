const User = require("../DB/User.dao");
const emailSend = require('../utils/emailutils')();
const { v_user_arg } = require('../utils/userUtils');

async function post_fun(ctx, next) {
  const { u_email } = ctx.request.body;

  const res = {
    code: -1,
    msg: "未知错误"
  };
  try {
    if (!v_user_arg("u_email", u_email)) {
      res.code = 401;
      throw Error("参数错误");
    }
    const { codeObj } = ctx.session;

    if (codeObj && Date.now() - codeObj.time < 56 * 1000) {
      throw Error("每次获取间隔需要小于60秒");
    }

    const code = Math.random() * 999999 | 0;

    if (!await emailSend.sendCode(u_email, code)) {
      res.code = 503;
      throw Error("邮件发送失败");
    }

    ctx.session.codeObj = {
      code,
      time: Date.now()
    }

    res.code = 200;
    res.msg = "获取验证码成功，请查看邮箱 如收件箱找不到请查看垃圾箱";
  } catch (error) {
    res.msg = error.message || error;
  }

  ctx.body = {
    ...res
  };

}

module.exports = {
  "POST /api/code": post_fun
}