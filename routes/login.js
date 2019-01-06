const User = require("../DB/User.dao");
var crypto = require('crypto')

async function get_fun(ctx, next) {

  // render 默认使用 state 中的属性 且如果 state中有参数就不再取传递的参数
  await ctx.render('login', {
    subhead: "登陆"
  });
  console.log(ctx.session);

}
async function post_fun(ctx, next) {
  const { u_login, u_pwd } = ctx.request.body;
  const res = {
    code: -1,
    msg: "未知错误"
  };
  try {

    // 验证数据

    if (!u_login || !u_pwd) {
      res.code = 401;
      res.msg = "参数错误";
    }

    const md5 = crypto.createHash('md5');
    const md5_res = md5.update(u_pwd).digest('hex')

    const login_res_user = await User.login(u_login, md5_res);

    // 查询数据库登陆

    if (login_res_user) {
      res.code = 200;
      res.msg = "登陆成功";
      ctx.session.user = login_res_user;
    } else {
      res.code = 401;
      res.msg = "账户或密码错误";
    }

  } catch (error) {
    console.error(error);
  }

  ctx.body = {
    ...res
  };

}

module.exports = {
  "GET /login": get_fun,
  "POST /api/login": post_fun
}