module.exports = function () {

  return async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      ctx.response.status = err.statusCode || err.status || 500;
      
      ctx.response.body = {
        code: `${ctx.response.status}`,
        message: err.message
      };
    }
  }

}