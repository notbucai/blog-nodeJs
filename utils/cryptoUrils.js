var crypto = require('crypto');

function md5(text) {
  const md5 = crypto.createHash('md5');
  const md5_res = md5.update(text).digest('hex');
  return md5_res;
}

module.exports = {
  md5
}