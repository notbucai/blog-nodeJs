const path = require('path');
const { root } = require('../../config/website.config');
/**
 *  图片上传
 * @param {Content} ctx 
 * @param {*} next 
 */
async function uploadImg(ctx, next) {

  ctx.body = {
    "code": "0000",
    "msg": "",
    "data": {
      "src": root + ctx.request.files.img.path.replace(path.join(__dirname, "../../public"), "")
    }
  };

}

module.exports = {
  "POST /api/uploadImg": uploadImg,
}