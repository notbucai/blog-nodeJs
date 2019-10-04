async function get_fn(ctx) {

  ctx.jwt.user = null;
  ctx.throw(403);

}

module.exports = {
  "GET /api/admin/logout": get_fn
}