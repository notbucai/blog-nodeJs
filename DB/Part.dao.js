const mongoose = require('./dbUtlis.js');
/*
{
	_id:ObjectId,
	title:String,
	url:String,
}

*/
const Schema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
    unique: true
  }

});

const Part = mongoose.model('Part', Schema);

module.exports = Part;

// const user = new User({
//   u_name: "123123",
//   u_email: "123123",
//   is_admin: true,
// });

// user.save().then((a)=>{
//   console.log(a);
// });

Part.find().then((a) => {
  console.log(a);
});