const mongoose = require('./dbUtlis.js');

/*

{
	_id:ObjectId,
	p_id:ObjectId, //栏目id
	title:String,
	content:String,
	info:String,
	a_img:String,
	add_time:Date,
	update_time:Date,
	hits:Number
}

*/

const Schema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 60
  },
  content: {
    type: String,
    required: true
  },
  info: {
    type: String,
    required: true,
    maxlength: 300
  },
  p_id: {
    type: mongoose.Types.ObjectId,
    default: null
  }, //栏目id
  a_img: {
    type: String,
    default: null
  },
  add_time: {
    type: Date,
    default: Date.now,
  },
  update_time: {
    type: Date,
    default: Date.now
  },
  hits: {
    type: Number,
    default: 0
  }
});

Schema.static('page',async function (p_id, index, pageSize = 10) {
  const whele = {};
  let Count = index * pageSize;

  if (p_id) {
    whele.p_id = p_id;
  }

  return await this.find(whele)
    .sort({_id:-1})
    .limit(pageSize)
    .skip(Count);
});

const Articles = mongoose.model('Article', Schema);

module.exports = Articles;



// const article = new Articles({
//   title: "新的文章",
//   content: "22873",
//   info: "测试简介lll123×&%￥%……&×（）家的沙发上",
// });

// article.save().then((e, d) => {
//   console.log(e, d);
// });

// Articles.find().then((e, d) => {
//   console.log(e, d);
// })
// Articles.remove({ _id: "5c24314b1751c55354004a89" }).then((e, d) => {
//   console.log(e, d);
// })

// Articles.aggregate([
//   {
//     $project: {
//       title: 1,
//       timestamp: 1,
//     }
//   },
//   {
//     $sort: { timestamp: -1 }
//   },
//   {
//     $group: {
//       _id: { year: { $year: "$timestamp" } },
//       count: { $sum: 1 },
//       list: { $push: "$$ROOT" }
//     }
//   },
//   {
//     $sort: { _id: -1 }
//   },
//   {
//     $project: {
//       year: '$_id.year',
//       count: 1,
//       list: 1,
//       _id: 0,
//     }
//   },
// ]).then((docs) => {
//   console.log(JSON.stringify(docs, null, 2));

// })

// Articles.update({ _id: "5c243308f712b031505ad0e1"}, {title:"00000000000000000000000000***************"}, function (error) {
//   if (error) {
//     console.error(error);
//   } else {
//     console.error("更新用户名成功")
//   }
// })


// Articles.find({ _id: "5c243308f712b031505ad0e1"}).then((e, d) => {
//   console.log(e, d);
// })