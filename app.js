const Koa = require('koa');
const static = require('koa-static');
const views = require('koa-views');
const session = require("koa-session2");
const bodyparser = require('koa-bodyparser');
const path = require('path');

const routes = require('./Middleware/routes');
const Store = require("./Middleware/Store");

const port = 3188;

const app = new Koa();

const STATIC_PATH = './public';

app.use(static(
  path.join(__dirname, STATIC_PATH)
));

app.use(views(path.join(__dirname, './views'), { extension: 'ejs' }));

app.use(session({
  store: new Store(),
  maxAge: 2 * 60 * 60 * 1000
}));

app.use(async (ctx, next) => {
  ctx.state = {
    title: "不才's blog"
  };
  await next();
});

app.use(bodyparser());

app.use(routes('./routes'));

app.use(ctx => {
  // refresh session if set maxAge
  console.log("清理session中。。。");

  ctx.session.refresh();
});

app.listen(port, () => {
  console.log("http://localhost:" + port);
});
