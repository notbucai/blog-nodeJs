const mongoose = require('./dbUtlis.js');
/*
{
	_id:ObjectId,
	title:String,
	url:String,
}

*/
const Schema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  }

});

const Tag = mongoose.model('Tag', Schema);

module.exports = Tag;

// const user = new User({
//   u_name: "123123",
//   u_email: "123123",
//   is_admin: true,
// });

// user.save().then((a)=>{
//   console.log(a);
// });

Tag.find().then((a) => {
  console.log(a);
});