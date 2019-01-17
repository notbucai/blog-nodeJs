const Comment = require('../DB/Comment.dao');
const Article = require('../DB/Article.dao');
const Part = require('../DB/Part.dao');
const { time2DateStr } = require('../utils/TimeTools');


module.exports = function () {

  const init = {
    title: "不才's blog",
    introduction: "啥也不会 -不才",
    time2DateStr
  }

  return async function (ctx, next) {

    const navs = await Part.getNavs();
    const newComments = await Comment.newComments();
    const newArticles = await Article.newArticles();
    const hotArticles = await Article.hotArticles();

    // hotArticles

    // console.log(navs);

    ctx.state = {
      ...init,
      user: ctx.session.user,
      newComments,
      newArticles,
      hotArticles,
      navs,
    };
    await next();
  }

}