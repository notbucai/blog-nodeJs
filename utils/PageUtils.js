const Article = require('../DB/Article.dao');
const Part = require('../DB/Part.dao');

// c_len当前，n_len显示长度，a_len 总长度
function getPageLen(c_len, a_len, n_len = 6) {

  const qh = n_len / 2 | 0;

  let stat = c_len - qh < 0 ? 0 : c_len - qh;

  let end = c_len + n_len - (c_len - stat) > a_len ? a_len : c_len + n_len - (c_len - stat);
  // console.log(a_len);

  return {
    stat,
    end
  }

}

/**
 * 获取当前分页的参数
 * @param {Number} page_index 传递当前分页的参数
 */
async function getPageArgs(part_url, page_index) {
  let p_id = null;
  let part = null;
  let $where = {}
  if (part_url) {
    part = (await Part.getNav(part_url));

    p_id = part && part._id || null;
    part_url = "/part/" + part_url;
    $where.p_id = p_id;
  }

  const articles = await Article.page(p_id, page_index);

  const page_size = await Article.page_size($where);

  const pag_nav_show = getPageLen(page_index, page_size);

  return {
    articles,
    page_size,
    page_index,
    pag_nav_o: pag_nav_show,
    part,
    isnavigation: true,
    part_url: part_url,
    subhead: part && part.title || null
  }

}

/**
 * 搜索
 * @param {String} key 搜索的参数
 */
async function searchArticles(key) {


  const articles = await Article.search(key);

  // console.log(articles);

  return {
    articles,
    page_size: null,
    page_index: null,
    pag_nav_o: null,
    part: {
      title: key,
      info: key + " 的搜索结果"
    },
    part_url: null,
    isnavigation: false,
    subhead: key + "的搜索结果"
  }

}

module.exports = {
  getPageArgs,
  searchArticles
}