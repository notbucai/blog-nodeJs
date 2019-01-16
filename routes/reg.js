const User = require("../DB/User.dao");
var crypto = require('crypto')

async function get_fun(ctx, next) {

  // render 默认使用 state 中的属性 且如果 state中有参数就不再取传递的参数
  await ctx.render('reg', {
    subhead: "注册"
  });
  console.log(ctx.session);

}
async function post_fun(ctx, next) {

  const { code,
    u_email,
    u_name,
    u_pwd } = req_body = ctx.request.body;

  const res = {
    code: -1,
    msg: "未知错误"
  };
  try {

    User.reg(req_body);

  } catch (error) {
    console.error(error);
  }

  ctx.body = {
    ...res
  };

}

module.exports = {
  "GET /reg": get_fun,
  "POST /api/reg": post_fun
}