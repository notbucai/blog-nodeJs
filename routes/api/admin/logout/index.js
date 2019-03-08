async function get_fn(ctx) {

  ctx.session.user = null;
  ctx.throw(403);

}

module.exports = {
  "GET /api/admin/logout": get_fn
}