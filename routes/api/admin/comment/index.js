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

  if (!commit || !commit.is_scope) {
    ctx.body = {
      code: "0000",
      msg: '',
    };
    return;
  }

  const { a_id, r_u_id, content, u_id: c_u_id } = commit;
  const users = [];

  try {
    // 获取文章
    const articleCtx = await Article.findById(a_id);

    // 获取文章发表者
    const u_id = articleCtx.u_id;
    const id1 = u_id && u_id.toString();
    const id2 = r_u_id && r_u_id.toString();
    const me_id = c_u_id && c_u_id.toString();


    const aUserCtx = await User.findById(u_id);
    if (me_id !== id1) {
      aUserCtx && users.push(aUserCtx);
    }

    if (r_u_id) {
      if (me_id !== id2) {
        const rUserCtx = await User.findById(r_u_id);
        rUserCtx && users.push(rUserCtx);
      }
    }

    // 获取回复的用户
    Array.from(new Set(users)).forEach(({ u_email, nickname }) => {
      console.log(`send: ${u_email} in ${nickname}`);

      emailutils.sendComment(u_email, nickname, articleCtx.title, `http://blog.ncgame.cc/article/${articleCtx._id}`, Buffer.from(content, 'base64').toString());
    });
    console.log(users);

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