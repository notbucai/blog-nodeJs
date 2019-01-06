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
    required: true,
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

const Link = mongoose.model('Link', Schema);
module.exports = Link;

// const article = new Articles({
//   title: "**测试===",
//   content: "1231231",
//   info: "99999",
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