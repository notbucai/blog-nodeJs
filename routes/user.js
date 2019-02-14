const path = require('path');

const User = require('../DB/User.dao');
const Comment = require('../DB/Comment.dao');
const Focus = require('../DB/Focus.dao');


async function get_fun(ctx, next) {

  const _id = path.basename(ctx.url);

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
    title: "21",
    subhead: "",
    _id,
    current_user,
    current_comments,
    toFocusMe,
    meAFocus,
    isFocusUser
  });

}

module.exports = {
  "GET /user/:id": get_fun
}