const { readdirSync } = require('fs');
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

const init = (dir) => {

  const route_files = readdirSync(dir);

  route_files.forEach((route_name) => {
    console.log(resolve(dir, route_name));

    const router = require(resolve(dir, route_name));

    for (const key in router) {

      if (router.hasOwnProperty(key)) {

        const [method, url] = key.split(' ');

        const fun = router[key];

        addRouter({ method, url }, fun);

      }
    }

  });

  return koaRouter.routes();

}

module.exports = init;