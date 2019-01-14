const Article = require('../DB/Article.dao');
const { time2DateStr } = require('../utils/TimeTools');
const path = require('path');

// c_len当前，n_len显示长度，a_len 总长度
function getPageLen(c_len, a_len, n_len = 6) {

  const qh = n_len / 2 | 0;

  let stat = c_len - qh < 0 ? 0 : c_len - qh;

  let end = c_len + n_len - (c_len - stat) + 1 >= a_len ? a_len : c_len + n_len - (c_len - stat) + 1;

  return {
    stat,
    end
  }

}

/**
 * 获取当前分页的参数
 * @param {Number} page_index 传递当前分页的参数
 */
async function getPageArgs(page_index) {
  const articles = await Article.page(null, page_index);

  const page_size = await Article.page_size();

  const pag_nav_show = getPageLen(page_index, page_size);
  // console.log(articles);
  
  return {
    articles,
    page_size,
    page_index,
    pag_nav_o: pag_nav_show
  }

}

async function get_fun_index(ctx, next) {
  const page_index = 0;

  // render 默认使用 state 中的属性 且如果 state中有参数就不再取传递的参数
  await ctx.render('index', {
    ...await getPageArgs(page_index),
    time2DateStr,
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
      ...await getPageArgs(page_index),
      time2DateStr,
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