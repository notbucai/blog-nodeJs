const mongoose = require('./dbUtlis.js');
const { md5 } = require('../utils/cryptoUrils');
/*
{
	_id:ObjectId,
	u_name:String,
	u_pwd:String,
	u_email:String,
	is_admin:Boolean,
	reg_time:Date,
	login_time:Date,
	login_ip:String,
	id_reg:Boolean // 是否注册成功
}
*/
const Schema = mongoose.Schema({
  u_name: {
    type: String,
    required: true,
    unique: true,

  },
  nickname: {
    type: String,
    default() {
      return this.nickname || this.u_name;
    }
  },
  u_info: {
    type: String,
    default: ""
  },
  u_pwd: {
    type: String,
    required: true
  },
  u_email: {
    type: String,
    unique: true,
    set: decodeURIComponent,
  },
  u_img: { // 用户头像
    type: String,
    default: ""
  },
  u_website: {
    type: String,
    default: "",
  },
  is_admin: {
    type: Boolean,
    default: false
  },
  id_reg: {
    type: Boolean,
    default: false
  },
  reg_time: {
    type: Date,
    default: Date.now,
  },
  login_time: {
    type: Date,
    default: Date.now
  },
  login_ip: {
    type: String,
    default: null
  }
});


Schema.static('login', async function (doc) {

  const db_res = await this.find({
    u_pwd: md5(doc.u_pwd),
    $or: [
      { u_name: doc.u_name },
      { u_email: doc.u_email }
    ]
  });

  return db_res && db_res.length && db_res[0];

});

Schema.static('reg', async function (doc) {

  const { u_name, u_email } = doc;

  const may_user = await this.findOne({ $or: [{ u_name }, { u_email }] });

  if (may_user) {
    return false;
  }
  doc.u_pwd = md5(doc.u_pwd);
  await doc.save();

  return true;

});

Schema.static('repwd', async function (doc) {

  const { u_email } = doc;

  const may_user = await this.findOne({ u_email });

  if (!may_user) {

    return false;

  }

  may_user.u_pwd = md5(doc.u_pwd);

  await doc.updateOne({ u_email }, may_user);

  return true;

});

Schema.static('getUserById', async function (u_id) {
  const userData = await this.findOne({
    _id: u_id
  });

  return userData;
});

const User = mongoose.model('User', Schema);


module.exports = User;


const user = new User({
  u_name: "test1",
  u_pwd: "40d628dc4880d42b93972c1e640d301b",
  u_email: "123241@qq.com",
  is_admin: true,
});

// user.save();
// console.log(user);


// User.find().then((a) => {
//   console.log(a);
// });