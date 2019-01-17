const path = require('path');
const Article = require('../DB/Article.dao');



async function get_fun(ctx, next) {


  try {
    const part_name = path.basename(ctx.url);

    const currendArticle = await Article.OneArticle(part_name);
    console.log(currendArticle);

    // render 默认使用 state 中的属性 且如果 state中有参数就不再取传递的参数
    await ctx.render('article', {
      currendArticle
    });

  } catch (error) {
    ctx.redirect("/");    
  }

}

module.exports = {
  "GET /article/:id": get_fun,
  // "POST /api/login": post_fun
}