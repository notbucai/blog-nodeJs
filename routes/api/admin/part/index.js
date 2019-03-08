const Part = require('../../../../DB/Part.dao');

async function get_all_part(ctx, next) {
  const navs = await Part.getNavs();
  ctx.body = {
    code: "0000",
    msg: "",
    data: navs
  }
}

async function post_addAndUpdate(ctx, next) {
  const body = ctx.request.body;

  const doc = new Part(body);

  await Part.addAndUpdate(doc);

  ctx.body = {
    code: "0000",
    msg: "",
    data: doc
  }
}

async function post_deleteById(ctx) {
  const { id } = ctx.request.body;
  Part.deleteById(id);
  ctx.body = {
    code: "0000",
    msg: "",
  }
}

module.exports = {
  "GET /api/admin/part": get_all_part,
  "POST /api/admin/part/addAndUpdate": post_addAndUpdate,
  "POST /api/admin/part/deleteById": post_deleteById,
}