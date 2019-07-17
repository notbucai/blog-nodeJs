const { SecretId, SecretKey, Location } = require('../config/cos.config');
const COS = require('cos-nodejs-sdk-v5');
const fs = require('fs');
const { promisify } = require('util');
const cos = new COS({
  SecretId: SecretId,
  SecretKey: SecretKey
});

module.exports = {
  async upload(filePath, name) {
    const putObject = promisify(cos.putObject).bind(cos);
    let res;
    await putObject({
      Bucket: 'bucai-1252379971',
      Region: 'ap-guangzhou',
      Key: name,
      Body: fs.createReadStream(filePath), // 这里传入前缀
    });
    res = {
      code: 0,
      path: Location + (name.startsWith('/') ? name.replace('/', '') : name)
    };

    return res;
  }
}