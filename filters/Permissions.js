const pType = require('./permissionsType');
const url = require('url');
module.exports = function (pConfig) {
  // 读取 路由
  return async function (ctx, next) {
    
    const url_o = ctx.url;
    const user = ctx.jwt.user || {};
    console.log(user);

    // 获取路径
    const path = url.parse(url_o).pathname;

    // 判断路径是否允许当前用户
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