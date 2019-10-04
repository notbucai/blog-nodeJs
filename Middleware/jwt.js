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

function createCookieToken(ctx) {
  return async (data, options = {}) => {
    const payload = (await sign(data, options));
    ctx.cookies.set('Authorization', payload, {
      httpOnly: false,
      overwrite: false,
      maxAge: 1000 * 60 * 60 * 24,
    });
  }
}

module.exports = function (privateKey) {
  if (!privateKey) throw new Error("privateKey 不存在");
  secretOrPrivateKey = privateKey;

  return async (ctx, next) => {

    let user;
    try {
      const Authorization = ctx.cookies.get('Authorization') || ctx.cookies.get('authorization') || ctx.headers.authorization || ctx.headers.Authorization || "";
      const token = Authorization.split(' ').pop();
      user = await getPayload(token);
    } catch (error) {
      console.log(error)
    }

    ctx.jwt = {
      sign: sign,
      getPayload: getPayload,
      createCookieToken: createCookieToken(ctx),
      get user() {
        return user;
      },
      set user(data) {
        createCookieToken(ctx)(JSON.stringify(data));
      }
    }

    await next();
  }
}