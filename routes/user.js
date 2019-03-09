const { md5 } = require('../utils/cryptoUrils');

const User = require('../DB/User.dao');
const Comment = require('../DB/Comment.dao');
const Focus = require('../DB/Focus.dao');

async function get_setting(ctx) {
  const user = ctx.session.user;

  if (!user) {
    ctx.throw(403);
    return;
  };

  const current_user = await User.getUserById(user._id);

  await ctx.render('setting', {
    subhead: "资料设置",
    current_user
  });
}

async function post_setting(ctx) {
  const body = ctx.request.body;

  const { _id } = ctx.session.user;

  const changeData = {};

  changeData.u_img = body.u_img;
  changeData.u_info = body.u_info;
  changeData.nickname = body.nickname;

  body.u_pwd && body.u_pwd.length >= 6 && (changeData.u_pwd = md5(body.u_pwd));

  User.updateUserData(_id, changeData);

  ctx.body = `<script>alert("修改成功");window.location.href = "/user/setting"</script>`;
  // ctx.response.redirect('/user/setting');

}

async function get_fun(ctx, next) {

  const _id = ctx.params.id;

  if (_id == 'setting') {
    await next();
    return;
  }

  if (!_id) {
    ctx.throw(500);
    return;
  };

  const current_user = await User.getUserById(_id);

  if (!current_user) {
    ctx.throw(500);
    return;
  }

  const current_comments = await Comment.getCommentsByUid(_id);

  const toFocusMe = await Focus.getToFocusMe(_id);
  const meAFocus = await Focus.getMeAFocus(_id);

  let isFocusUser = false;
  if (ctx.session.user && ctx.session.user._id) {
    isFocusUser = await Focus.isFocusUser(new Focus({
      u_id: ctx.session.user._id,
      f_u_id: _id
    }));
  }

  await ctx.render('user', {
    subhead: current_user.nickname || current_user.u_name,
    _id,
    current_user,
    current_comments,
    toFocusMe,
    meAFocus,
    isFocusUser
  });

}

async function logout(ctx) {
  ctx.session.user = null;

  ctx.response.redirect('/login');
}


module.exports = {
  "GET /user/setting": get_setting,
  "POST /user/setting": post_setting,
  "GET /user/:id": get_fun,
  "GET /logout": logout, 
}