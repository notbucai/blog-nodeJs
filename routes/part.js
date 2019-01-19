const path = require('path');
const { time2DateStr } = require('../utils/TimeTools');
const { getPageArgs } = require('../utils/PageUtils');


async function get_fun_index(ctx, next) {
  const page_index = 0;
  console.log(1);
  const part_name = path.basename(ctx.url);
  console.log(part_name);
  const page_s = await getPageArgs(part_name, page_index);
  // render 默认使用 state 中的属性 且如果 state中有参数就不再取传递的参数
  await ctx.render('index', {
    ...page_s,
    time2DateStr,
  });

}


async function get_fun_page(ctx, next) {

  try {

    const page_index = Number(path.basename(ctx.url)) - 1;
    const part_url = path.basename(path.dirname(ctx.url));
    // console.log(part_url);
    console.log(22);

    console.log(part_url, page_index);

    if (page_index < 0 || page_index != 0 && !page_index) {
      throw new Error("参数错误");
    }

    // render 默认使用 state 中的属性 且如果 state中有参数就不再取传递的参数
    await ctx.render('index', {
      ...await getPageArgs(part_url, page_index),
      time2DateStr,
    });

  } catch (error) {
    console.log(error);
    
    ctx.redirect("/");

  }

}


module.exports = {
  "GET /part/:part": get_fun_index,
  "GET /part/:part/:page": get_fun_page,
  // "POST /api/login": post_fun
}