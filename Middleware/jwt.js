const jwt = require('jsonwebtoken');
const jwtVerify = require('util').promisify(jwt.verify);
let secretOrPrivateKey = null;

async function sign(payload, options = {}) {
  return jwt.sign(payload, secretOrPrivateKey || "def", options);
}

async function getPayload(token) {
  if (token) {
    return await jwtVerify(token, secretOrPrivateKey || "def");
  } else {
    return null;
  }
}

module.exports = function (privateKey) {
  if (!privateKey) throw new Error("privateKey 不存在");
  secretOrPrivateKey = privateKey;
  return async (ctx, next) => {

    ctx.jwt = {
      sign: sign,
      getPayload: getPayload
    }

    await next();
  }
}