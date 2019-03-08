const Link = require('../../../../DB/Links.dao');

async function get_all(ctx, next) {
  const data = await Link.findAll();
  ctx.body = {
    code: "0000",
    msg: "",
    data
  }
}

async function post_addAndUpdate(ctx, next) {
  const body = ctx.request.body;

  const doc = new Link(body);

  await Link.addAndUpdate(doc);

  ctx.body = {
    code: "0000",
    msg: "",
    data: doc
  }
}

async function post_deleteById(ctx) {
  const { id } = ctx.request.body;
  Link.deleteById(id);
  ctx.body = {
    code: "0000",
    msg: "",
  }
}

module.exports = {
  "GET /api/admin/link": get_all,
  "POST /api/admin/link/addAndUpdate": post_addAndUpdate,
  "POST /api/admin/link/deleteById": post_deleteById,
}