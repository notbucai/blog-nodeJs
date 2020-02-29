const path = require('path');
const Comment = require('../DB/Comment.dao');
const emailutils = require('../utils/emailutils')();
const Article = require('../DB/Article.dao');
const User = require('../DB/User.dao');

async function post_fun(ctx, next) {

  const res = {
    code: -1,
    msg: "未知错误"
  };

  try {

    const { a_id, content, r_u_id } = ctx.request.body;

    if (!a_id || !content) {
      res.code = 401;
      throw Error("参数错误");
    }

    const { user } = ctx.jwt;

    const comment = new Comment({
      a_id,
      content,
      r_u_id: r_u_id || null,
      u_id: user._id,
      is_scope: true,
    });


    const res_c = await Comment.addComment(comment);

    if (res_c) {
      res.code = 200;
      res.msg = "评论成功";

      const { a_id, r_u_id, content, u_id: c_u_id } = comment;
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

    } else {
      res.code = -1;
      res.msg = "发表失败";
    }

  } catch (error) {
    res.msg = error.message || error
  }

  ctx.body = {
    ...res
  };
}

module.exports = {
  "POST /api/comment": post_fun,
  // "POST /api/login": post_fun
}