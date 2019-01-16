const mongoose = require('./dbUtlis.js');
/*
{
	_id:ObjectId,
	title:String,
	url:String,
}

*/
const Schema = mongoose.Schema({
  t_id: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  a_id: {
    type: mongoose.Types.ObjectId,
    required: true,
  },

});

const TagMap = mongoose.model('TagMap', Schema);

module.exports = TagMap;

// const user = new User({
//   u_name: "123123",
//   u_email: "123123",
//   is_admin: true,
// });

// user.save().then((a)=>{
//   console.log(a);
// });

// TagMap.find().then((a) => {
//   console.log(a);
// });