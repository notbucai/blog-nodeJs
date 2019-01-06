

async function get_fun(ctx, next) {

  // render 默认使用 state 中的属性 且如果 state中有参数就不再取传递的参数
  await ctx.render('index', {
    subhead: "登陆"
  });
  console.log(ctx.session);

}


module.exports = {
  "GET /": get_fun,
  // "POST /api/login": post_fun
}