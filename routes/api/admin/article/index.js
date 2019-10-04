const Article = require('../../../../DB/Article.dao');

async function GET_articlePage(ctx, next) {

  const {
    page,
    limit,
    id,
    title,
    author,
    p_id } = ctx.query;

  const where = {};
  id && (where['id'] = id);
  title && (where['title'] = {
    $regex: title
  });
  author && (where['author'] = {
    $regex: author
  });


  const articles = await Article.page(p_id, Number(page) - 1, Number(limit), where);
  const count = await Article.count();
  // $regex: keyword, $options: '$i'
  ctx.body = {
    code: "0000",
    msg: "",
    count: count,
    data: articles
  };
}

async function GET_ArticleById(ctx, next) {

  const { id } = ctx.query;

  const article = await Article.OneArticle(id);

  ctx.body = {
    code: "0000",
    msg: "",
    data: article
  };

}
/**
 * 删除
 * @param {Context} ctx 
 * @param {*} next 
 */
async function POST_deleteById(ctx, next) {
  const { id } = ctx.request.body;

  Article.removeById(id);

  ctx.body = {
    code: "0000",
    msg: "",
  };

}
/**
 * 添加和修改文章
 * @param {Context} ctx 
 * @param {*} next 
 */
async function POST_addAndUpdateById(ctx, next) {
  const body = ctx.request.body;

  const _id = body._id || null;
  !body.u_img && delete body.u_img;
  const article = await Article.OneArticle(_id) || {};
  
  const doc = new Article({
    ...article,
    u_id: ctx.jwt.user._id,
    ...body
  });

  Article.addAndUpdate(doc);

  ctx.body = {
    code: "0000",
    msg: "",
    data: doc
  };

}




module.exports = {
  "GET /api/admin/article/page": GET_articlePage,
  "GET /api/admin/article/getArticleById": GET_ArticleById,
  "POST /api/admin/article/deleteById": POST_deleteById,
  "POST /api/admin/article/addAndUpdateById": POST_addAndUpdateById,
}