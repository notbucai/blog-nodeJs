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
  info: {
    type: String
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

Schema.static('addAndUpdate', async function (doc) {

  await this.updateOne({
    _id: doc._id
  }, doc, {
      upsert: true
    });

});


Schema.static('deleteById', async function (_id) {
  _id = mongoose.Types.ObjectId(_id);
  await this.deleteOne({ _id });
});


const Part = mongoose.model('Part', Schema);

module.exports = Part;
