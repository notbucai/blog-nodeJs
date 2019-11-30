const Comment = require('../../../../DB/Comment.dao');
const Article = require('../../../../DB/Article.dao');
const User = require('../../../../DB/User.dao');

const emailutils = require('../../../../utils/emailutils')();

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

  // 获取评论的细节 
  const commit = await Comment.findById(_id);

  if (!commit.is_scope) {
    ctx.body = {
      code: "0000",
      msg: '',
    };
    return;
  }

  const { a_id, r_u_id, content } = commit;
  const users = [];
  // 获取文章
  const articleCtx = await Article.findById(a_id);

  // 获取文章发表者
  const u_id = articleCtx.u_id;
  if (Object.prototype.toString.call(r_u_id) === Object.prototype.toString.call(u_id)) {
    ctx.body = {
      code: "0000",
      msg: '',
    };
    return;
  }
  try {
    const aUserCtx = await User.findById(u_id);
    aUserCtx && users.push(aUserCtx);
    if (r_u_id) {
      const rUserCtx = await User.findById(r_u_id);
      rUserCtx && users.push(rUserCtx);
    }
    // 获取回复的用户
    users.forEach(({ u_email, nickname }) => {
      emailutils.sendComment(u_email, nickname, articleCtx.title, `http://blog.ncgame.cc/article/${articleCtx._id}`, Buffer.from(content, 'base64').toString());
    });
  } catch (error) {
    console.log(error);
  }

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