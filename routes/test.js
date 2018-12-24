async function get_fun(ctx, next) {
  ctx.body = "tets";
}

module.exports = {
  "GET /test": get_fun
}