const pType = require('./permissionsType');
const url = require('url');
module.exports = function (needVRouteConfig) {
  // 读取 路由
  const pConfig = require(needVRouteConfig);

  return async function (ctx, next) {
    const url_o = ctx.url;
    const user = ctx.session.user;

    const path = url.parse(url_o).pathname

    switch (pConfig[path]) {
      case pType.ADMIN: // 管理权限

        if (!user || !user.is_admin) { // 如果登陆了而且还有管理权限/
          ctx.throw(403);
          return;
        }

        break;
      case pType.USER: // 用户权限

        if (!user || !user._id) { // 如果登陆了
          ctx.throw(403);
          return;
        }

        break;

      default:
        break;
    }

    await next();
  }

}