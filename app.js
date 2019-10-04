const Koa = require('koa');
const jwt = require('koa-jwt');
const static = require('koa-static');
const views = require('koa-views');
// const session = require("koa-session2");
const bodyparser = require('koa-bodyparser');
const cors = require('koa-cors');
const koaBody = require('koa-body');
const url = require('url');
const path = require('path');
const fs = require('fs');

const routes = require('./Middleware/routes');
const Store = require("./Middleware/Store");
const RedisMiddleware = require("./Middleware/Redis");
const jwtMiddleware = require("./Middleware/jwt");

const Permissions = require("./filters/Permissions");
const initFilters = require("./filters/init");
const errorFilters = require("./filters/error");

const CONFIG = './config';
// config
const jwtConfig = require(CONFIG + "/jwt.config");
const pConfig = require(CONFIG + '/p.config.js');
const jwtRouters = Object.keys(pConfig);

// 端口
const port = 3188;
// koa 主要对象
const app = new Koa();
// 静态资源目录
const STATIC_PATH = './public';
// 配置文件目录

// 配置静态资源
app.use(static(
  path.join(__dirname, STATIC_PATH)
));
// 配置ejs 渲染
app.use(views(path.join(__dirname, './views'), { extension: 'ejs' }));
// 配置 seeeion 
// app.use(session({
//   store: new Store(),
//   maxAge: 2 * 60 * 60 * 1000
// }));
// 配置 跨域
app.use(cors({
  origin: function (ctx) {
    return ctx.req.headers.origin; // 这样就能只允许 http:/ / localhost: 8080 这个域名的请求了
  },
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 24 * 1024 * 3600,
  credentials: true,
  allowMethods: ['GET', 'POST', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));

// Custom 401 handling if you don't want to expose koa-jwt errors to users
app.use((ctx, next) => {
  return next().catch((err) => {
    ctx.status = err.status || ctx.status;
    ctx.body = {
      code: err.status || ctx.status || 500,
      msg: err.message || 'Service Error'
    };
  });
});
// Redis
app.use(RedisMiddleware());

// // 配置session 刷新
// app.use(async (ctx, next) => {
//   ctx.cookies.set('Authorization',await ctx.jwt.sign('sign'));
//   await next();
// });

// JWT
app.use(jwt({
  secret: jwtConfig.SECRET_OR_PRIVATE_KEY,
  cookie: 'Authorization',
  // key: 'jwtdata',
  // passthrough: true,
}).unless(function (ctx) {
  const path = url.parse(ctx.url).pathname;
  return jwtRouters.indexOf(path) === -1;
}));

app.use(jwtMiddleware(jwtConfig.SECRET_OR_PRIVATE_KEY));

app.use(async (ctx, next) => {
  console.log(123);
  await next();
});

// // 配置统一的 路由权限
app.use(Permissions(pConfig));

// 配置 文件上传中间件
app.use(koaBody({
  multipart: true,
  formidable: {
    uploadDir: path.join(__dirname, 'public/upload/'), // 设置文件上传目录
    keepExtensions: true, // 保持文件的后缀
    maxFieldsSize: 2 * 1024 * 1024, // 文件上传大小，缺省2M
    onFileBegin: (name, file) => { // 文件上传前的设置
      const fp = path.join(__dirname, 'public/upload/');
      if (!fs.existsSync(fp)) { // 检查是否有“public/upload/”文件夹
        fs.mkdirSync(fp); // 没有就创建
      }
      // console.log(`bodyparse: name:${name}; file:${util.inspect(file)}`);
    }
  }
}));

// 配置 统一的错误 处理 （拦截）
app.use(errorFilters());
// 配置初始化 
app.use(initFilters());
// 配置 post body 内容
app.use(bodyparser());

// // 配置session 刷新
// app.use(async (ctx, next) => {
//   // refresh session if set maxAge
//   await next();
//   ctx.jwt.refresh();
// });
// 配置路由
app.use(routes('./routes'));

// 监听端口
app.listen(port, () => {
  console.log("http://localhost:" + port);
});
