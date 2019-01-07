const Article = require('../DB/Article.dao');

async function get_fun(ctx, next) {

  console.log(await Article.page(null, 0));


  // render 默认使用 state 中的属性 且如果 state中有参数就不再取传递的参数
  await ctx.render('index', {
    introduction: "啥也不会 -不才"
  });

}


module.exports = {
  "GET /": get_fun,
  // "POST /api/login": post_fun
}