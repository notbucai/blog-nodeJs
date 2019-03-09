const Links = require('../DB/Links.dao');
async function get_fun(ctx, next) {

  try {
    const links = await Links.findAll();
    links.sort(() => Math.random() > 0.5 ? -1 : 1);

    await ctx.render('links', {
      subhead: "友情链接",
      links
    });

  } catch (error) {
    ctx.redirect("/");
  }


}

module.exports = {
  "GET /links": get_fun,
  // "POST /api/login": post_fun
}