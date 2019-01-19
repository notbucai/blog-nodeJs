const path = require('path');
const Comment = require('../DB/Comment.dao');



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

    const { user } = ctx.session;

    if (!user || !user._id) {
      res.code = 100;
      throw Error("登陆过期");
    }

    console.log(user,user._id);

    console.log(a_id, content);

    const comment = new Comment({
      a_id,
      content,
      r_u_id: r_u_id || null,
      u_id: user._id
    });
    
    // 5c3ff208125d840a880054ab

    console.log(comment); 

    const res_c = await Comment.addComment(comment);

    if(res_c){
      res.code = 200;
      res.msg = "评论成功";
    }else{
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