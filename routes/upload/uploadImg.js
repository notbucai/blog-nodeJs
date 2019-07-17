const path = require('path');
const { upload } = require('../../utils/Cos');
/**
 *  图片上传
 * @param {Content} ctx 
 * @param {*} next 
 */
async function uploadImg(ctx, next) {

  const { code, path: src } = await upload(ctx.request.files.img.path, ctx.request.files.img.path.replace(path.join(__dirname, "../../public"), ""));

  ctx.body = {
    "code": "0000",
    "msg": "",
    "data": {
      "src": src
    }
  };

}

module.exports = {
  "POST /api/uploadImg": uploadImg,
}