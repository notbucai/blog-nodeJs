const User = require("../DB/User.dao");
const { v_user_args } = require("../utils/userUtils");

async function get_fun(ctx, next) {

  // render 默认使用 state 中的属性 且如果 state中有参数就不再取传递的参数
  await ctx.render('repwd', {
    subhead: "重置"
  });

}
async function post_fun(ctx, next) {

  const { code,
    u_email,
    u_pwd } = req_body = ctx.request.body;

  const res = {
    code: -1,
    msg: "未知错误"
  };
  try {

    // TODO 这里 是留给 验证 code 的

    if (!v_user_args({ u_email, u_pwd, code })) {
      ctx.code = 401;
      throw Error("参数错误，请检查！");
    }

    const { codeObj } = ctx.session;

    if (!codeObj || Date.now() - codeObj.time > 5 * 60 * 1000) {
      ctx.code = 504;
      throw Error("验证码失效，请重新获取验证码");
    }
    
    if(codeObj.code != code){
      ctx.code = 402;
      throw Error("验证码不匹配，请重试");
    }
    
    const user = new User(req_body);

    delete ctx.session.codeObj;
    const is_succeed = await User.repwd(user);

    if (is_succeed) {
      res.code = 200;
      res.msg = "重置成功";
    } else {
      res.code = 502;
      res.msg = "该用户不存在"
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
  "GET /repwd": get_fun,
  "POST /api/repwd": post_fun
}