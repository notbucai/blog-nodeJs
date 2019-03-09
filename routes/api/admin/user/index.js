const User = require('../../../../DB/User.dao');

async function get_all(ctx, next) {
  const { name, page, limit } = ctx.query;
  let where = {};

  name && (where = {
    $or: [
      {
        nickname: {
          $regex: name
        }
      },
      {
        u_name: {
          $regex: name
        }
      }
    ]
  });

  const data = await User.page(page - 1, parseInt(limit), where);
  const count = await User.count(where);

  ctx.body = {
    code: "0000",
    msg: "",
    count,
    data
  }
}

async function get_getUserById(ctx) {
  const { id } = ctx.query;

  const data = await User.getUserById(id);

  ctx.body = {
    code: "0000",
    msg: "",
    data
  }
}

async function get_getCurrentUser(ctx) {
  const { _id } = ctx.session.user;
  if (!_id) {
    ctx.throw(403);
    return;
  }
  const data = await User.getUserById(_id);

  ctx.body = {
    code: "0000",
    msg: "",
    data
  }
}

async function post_updateSome(ctx, next) {

  const { _id, u_name, u_email, u_pwd } = ctx.request.body;

  const prevData = await User.getUserById(_id);

  const where = { ...prevData };
  where._id = _id;
  where.u_name = u_name;
  where.u_email = u_email;
  u_pwd && (where.u_pwd = u_pwd);

  const user = new User(where);

  await User.updateSome(user);

  ctx.body = {
    code: "0000",
    msg: "",
    data: user
  }

}

async function post_deleteById(ctx) {

  ctx.body = {
    code: "123123",
    msg: "不能删除",
  }

}

async function post_setAdminById(ctx) {
  const id = ctx.request.body.id;
  const cu_id = ctx.session.user && ctx.session.user.id;
  if (cu_id != id) {
    await User.setAdminById(id);

    ctx.body = {
      code: "0000",
      msg: "",
    }
  } else {
    ctx.body = {
      code: "123",
      msg: "不能修改当前用户状态",
    }
  }

}

module.exports = {
  "GET /api/admin/user": get_all,
  "GET /api/admin/user/getUserById": get_getUserById,
  "GET /api/admin/user/getCurrentUser": get_getCurrentUser,
  "POST /api/admin/user/updateSome": post_updateSome,
  "POST /api/admin/user/deleteById": post_deleteById,
  "POST /api/admin/user/setAdminById": post_setAdminById,
}