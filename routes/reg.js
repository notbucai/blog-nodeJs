const User = require("../DB/User.dao");
const { v_user_args } = require("../utils/userUtils");

async function get_fun(ctx, next) {

  // render 默认使用 state 中的属性 且如果 state中有参数就不再取传递的参数
  await ctx.render('reg', {
    subhead: "注册"
  });
  // console.log(ctx.session);

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

    // TODO 这里 是留给 验证 code 的

    if (!v_user_args({ u_email, u_name, u_pwd })) {
      throw Error("参数错误，请检查！");
    }

    const user = new User(req_body);
    console.log(user);

    const reg_succeed= await User.reg(user);

    if(reg_succeed){
      res.code = 200;
      res.msg = "注册成功";
    }else{
      res.code = 502;
      res.msg = "该用户名或邮箱已被注册"
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
  "GET /reg": get_fun,
  "POST /api/reg": post_fun
}