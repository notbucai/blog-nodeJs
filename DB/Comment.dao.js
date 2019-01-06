const mongoose = require('./dbUtlis.js');
/*

{
	_id:ObjectId,
	u_id:ObjectId,
	a_id:ObjectId,
	r_u_id:ObjectId,// 回复 ID
	content:String,
	c_ip:String,
	c_time:Date,
}

*/
const Schema = mongoose.Schema({
  u_id: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  a_id: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  r_u_id: {
    type: mongoose.Types.ObjectId,
    default: null
  },
  content: {
    type: String,
    required: true,
  },
  c_ip: {
    type: String,
    default: null
  },
  c_time: {
    type: Date,
    default: Date.now,
  },
});

const Comment = mongoose.model('Comment', Schema);

module.exports = Comment;

// const user = new User({
//   u_name: "123123",
//   u_email: "123123",
//   is_admin: true,
// });

// user.save().then((a)=>{
//   console.log(a);
// });

Comment.find().then((a) => {
  console.log(a);
});