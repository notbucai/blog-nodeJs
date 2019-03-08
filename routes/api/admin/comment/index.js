const Comment = require('../../../../DB/Comment.dao');

async function get_page_fn(ctx, next) {

  const { page, limit, u_id, a_id, scope } = ctx.query;
  const where = Object.create({});

  u_id && (where.u_id = u_id);
  a_id && (where.a_id = a_id);
  scope && (where.is_scope = scope == 1);

  const data = await Comment.page(page - 1, parseInt(limit), where);
  const count = await Comment.count(where);
  ctx.body = {
    count,
    code: "0000",
    msg: '',
    data
  };
}

async function post_audit_fn(ctx) {

  const _id = ctx.request.body.id;

  await Comment.auditCommentById([{ _id }])

  ctx.body = {
    code: "0000",
    msg: '',
  };
}
async function post_deleteById_fn(ctx) {
  const _id = ctx.request.body.id;

  _id && await Comment.deleteCommentById(_id)

  ctx.body = {
    code: "0000",
    msg: '',
  };
}

module.exports = {
  "GET /api/admin/comment/page": get_page_fn,
  "POST /api/admin/comment/auditCommentById": post_audit_fn,
  "POST /api/admin/comment/deleteById": post_deleteById_fn,
}