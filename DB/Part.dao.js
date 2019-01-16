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
  },
  is_part: {
    type: Boolean,
    default: true
  }
});

Schema.static('getNavs', async function () {

  return await this.find({});

});

Schema.static('getNav', async function (part_url) {

  return await this.findOne({ url: part_url });

});

const Part = mongoose.model('Part', Schema);

module.exports = Part;

// const part = new Part({
//   title:"分类er",
//   url:"vbvb"
// });

// part.save().then((a)=>{
//   console.log(a);
// });

// part.find().then((a) => {
//   console.log(a);
// });