async function get_fun(ctx, next) {

  await ctx.render('user', {
    title: "21",
    subhead: "",
  });
}

module.exports = {
  "GET /user/:id": get_fun
}