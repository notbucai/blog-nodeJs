const fs = require('fs');
const path = require('path');
const Comment = require('../DB/Comment.dao');
const Article = require('../DB/Article.dao');
const Part = require('../DB/Part.dao');
const { time2DateStr } = require('../utils/TimeTools');
const marked = require('marked');

const websiteJsonStr = fs.readFileSync(path.join(__dirname, '../config/website.config.json'));

const website = JSON.parse(websiteJsonStr.toString());
website.startTimestamp = Date.now();
module.exports = function () {
  // 初始化一些静态数据
  const init = {
    title: "不才's blog",
    introduction: "啥也不会 -不才",
    keywords: "个人博客,不才,不才 Blog,bucai Blog,blog",
    description: "这是不才的个人博客，记录生活，学习笔记。欢迎各位常来看看。",
    ...website,
    time2DateStr,
    marked
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
      ...ctx.state,
      user: ctx.jwt.user,
      newComments,
      newArticles,
      hotArticles,
      navs,
    };
    // 执行下一个处理函数
    await next();
  }

}