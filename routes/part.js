const path = require('path');
const { getPageArgs } = require('../utils/PageUtils');


async function get_fun_index(ctx, next) {
  const page_index = 0;
  const part_name = path.basename(ctx.url);
  const page_s = await getPageArgs(part_name, page_index);
  // render 默认使用 state 中的属性 且如果 state中有参数就不再取传递的参数
  await ctx.render('index', {
    ...page_s,
  });

}


async function get_fun_page(ctx, next) {

  try {

    const page_index = Number(path.basename(ctx.url)) - 1;
    const part_url = path.basename(path.dirname(ctx.url));

    if (page_index < 0 || page_index != 0 && !page_index) {
      throw new Error("参数错误");
    }

    // render 默认使用 state 中的属性 且如果 state中有参数就不再取传递的参数
    await ctx.render('index', {
      ...await getPageArgs(part_url, page_index),
    });

  } catch (error) {
    console.error(error);
    
    ctx.redirect("/");
  }

}


module.exports = {
  "GET /part/:part": get_fun_index,
  "GET /part/:part/:page": get_fun_page,
  // "POST /api/login": post_fun
}