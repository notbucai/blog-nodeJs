const path = require('path');
const { getPageArgs } = require('../utils/PageUtils');


async function get_fun_index(ctx, next) {
  const page_index = 0;

  // render 默认使用 state 中的属性 且如果 state中有参数就不再取传递的参数
  await ctx.render('index', {
    ...await getPageArgs(null, page_index),
  });

}


async function get_fun_page(ctx, next) {

  try {

    const page_index = Number(path.basename(ctx.url)) - 1;
    // console.log(page);

    if (page_index < 0) {
      throw new Error("参数错误");
    }

    // render 默认使用 state 中的属性 且如果 state中有参数就不再取传递的参数
    await ctx.render('index', {
      ...await getPageArgs(null, page_index),
    });

  } catch (error) {

    ctx.redirect("/");

  }

}


module.exports = {
  "GET /": get_fun_index,
  "GET /page/:page": get_fun_page,
  // "POST /api/login": post_fun
}