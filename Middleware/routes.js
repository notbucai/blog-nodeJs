const { readdirSync, statSync } = require('fs');
const { resolve } = require('path');
const koaRouter = require('koa-router')();


function addRouter({ method, url }, fun) {
  switch (method) {
    case "GET":
      koaRouter.get(url, fun);
      break;
    case "POST":
      koaRouter.post(url, fun);
      break;
    case "DELETE":
      koaRouter.delete(url, fun);
      break;
    case "PUT":
      koaRouter.put(url, fun);
      break;
    default:
      break;
  }
}

/**
 * 初始化路由
 * @param {String} dir 路由目录
 */
const readRoutes = (dir) => {

  const route_files = readdirSync(dir);

  route_files.forEach((route_name) => {
    const target = resolve(dir, route_name);

    if (statSync(target).isDirectory()) {

      readRoutes(target);

    } else {

      const router = require(target);

      for (const key in router) {

        if (router.hasOwnProperty(key)) {

          const [method, url] = key.split(' ');

          console.info(method, url ,target);

          const fun = router[key];

          addRouter({ method, url }, fun);

        }
      }
    }
  });

  return koaRouter.routes();

}

module.exports = readRoutes;