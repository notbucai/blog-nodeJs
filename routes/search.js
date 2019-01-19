// keyword
const { searchArticles } = require('../utils/PageUtils');

async function get_fun(ctx, next) {

  const { keyword } = ctx.query;

  if (!keyword) {
    ctx.redirect('/');
  }

  await ctx.render('index', {
    subhead: "搜索",
    ...await searchArticles(keyword)
  });

  // console.log(ctx.query);

}
module.exports = {
  "GET /search": get_fun
}