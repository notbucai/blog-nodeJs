const User = require('../../../../DB/User.dao');

async function post_fun(ctx, next) {
  const { u_login, u_pwd } = ctx.request.body;
  const res = {
    code: -1,
    msg: "未知错误"
  };
  try {

    // 验证数据

    if (!u_login || !u_pwd) {
      res.code = "401";
      throw Error("参数错误");
    }

    const user = new User({ u_name: u_login, u_email: u_login, u_pwd });
    
    const login_res_user = await User.login(user);

    // 查询数据库登陆

    if (login_res_user) {
      res.code = "0000";
      res.msg = "登陆成功";
      ctx.jwt.user = login_res_user;
    } else {
      res.code = "401";
      throw Error("账户或密码错误");
    }

  } catch (error) {
    console.error(error);
    res.msg = error.message || error;
  }

  ctx.body = {
    ...res
  };

}

module.exports = {
  "POST /api/admin/login": post_fun
}