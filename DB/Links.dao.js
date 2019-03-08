const mongoose = require('./dbUtlis.js');

/*

{
	_id:ObjectId,
	title:String,
	info:String,
	link:String,
	l_img:String,

}

*/

const Schema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  info: {
    type: String,
  },
  link: {
    type: String,
    required: true,
  },
  l_img: {
    type: String,
    required: true,
  }
});

Schema.static('findAll', async function () {
  return await this.find();
});

Schema.static('addAndUpdate', async function (doc) {
  await this.updateOne({
    _id: doc._id
  }, doc, {
      upsert: true
    });
})

Schema.static('deleteById', async function (_id) {
  await this.deleteOne({ _id });
})

const Link = mongoose.model('Link', Schema);

module.exports = Link;
