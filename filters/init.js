const Comment = require('../DB/Comment.dao');
const Article = require('../DB/Article.dao');
const Part = require('../DB/Part.dao');
const { time2DateStr } = require('../utils/TimeTools');


module.exports = function () {
 // 初始化一些静态数据
  const init = {
    title: "不才's blog",
    introduction: "啥也不会 -不才",
    time2DateStr
  }
 // 初始化路由函数
  return async function (ctx, next) {
    // 获取 导航栏
    const navs = await Part.getNavs();
    // 获取最新的几条评论
    const newComments = await Comment.newComments();
    // 获取最新文章
    const newArticles = await Article.newArticles();
    // 配置热门的文章
    const hotArticles = await Article.hotArticles();
    // 将 初始化数据载入 
    ctx.state = {
      ...init,
      user: ctx.session.user,
      newComments,
      newArticles,
      hotArticles,
      navs,
    };
    // 执行下一个处理函数
    await next();
  }

}