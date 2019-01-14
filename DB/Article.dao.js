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
    required: true,
  }, //栏目id
  u_id: {
    type: mongoose.Types.ObjectId,
    required: true,
  }, //用户id
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

Schema.static('page', async function (p_id, index, pageSize = 10) {
  const whele = {};
  let Count = index * pageSize;
  console.log(Count);

  if (p_id) {
    whele.p_id = p_id;
  }

  return await this.aggregate([
    {
      $match: whele
    },
    {
      $sort: { _id: -1 }
    },
    {
      $skip: Count
    },
    {
      $limit: pageSize
    },
    {
      $lookup: { // 左连接
        from: "users", // 关联到order表
        localField: "u_id", // user 表关联的字段
        foreignField: "_id", // order 表关联的字段
        as: "user"
      }
    },
    {
      $unwind: { // 拆分子数组
        path: "$user",
        preserveNullAndEmptyArrays: true // 空的数组也拆分
      }
    },

    {
      $lookup: { // 左连接
        from: "parts", // 关联到order表
        localField: "p_id", // user 表关联的字段
        foreignField: "_id", // order 表关联的字段
        as: "part"
      }
    },
    {
      $unwind: { // 拆分子数组
        path: "$part",
        preserveNullAndEmptyArrays: true // 空的数组也拆分
      }
    },

    {
      $lookup: { // 左连接
        from: "comments", // 关联到order表
        localField: "_id", // user 表关联的字段
        foreignField: "a_id", // order 表关联的字段
        as: "comments"
      }
    },
    {
      $project: {
        comment_size: { $size: "$comments" },
        _id: 1,
        title: 1,
        info: 1,
        // content: 1,
        // article_size: { $count: 1 },
        user: 1,
        add_time: 1,
        a_img: 1,
        hits: 1,
        part: 1
      }
    }
  ])


});

Schema.static('page_size', async function (pageLen = 10) {
  const page_size = (((await this.countDocuments()) / pageLen) + 1) | 0;

  return page_size;

});

Schema.static('newArticles', async function (aLen = 6) {

  return await this.find({}).sort({ _id: -1 }).limit(aLen);

});

Schema.static('hotArticles', async function (aLen = 6) {

  return await this.find({}).sort({ hits: -1 }).limit(aLen);

});


const Articles = mongoose.model('Article', Schema);

module.exports = Articles;



// for (let index = 0; index < 100; index++) {
//   const article = new Articles({
//     title: index+" 空气质量“良”，也是一种伤害？",
//     content:index+ "昨天（1月4日），收到了一个好消息：2018年北京的空气比往年好了不少。根据北京市生态环境局发布的数据，2018年北京全市细颗粒物PM2",
//     info: ".5年均浓度51微克/立方米，比2017年同比下降12.1%，二氧化硫、二氧化氮和可吸入颗粒物（PM10）的数据也有改善。",
//     u_id: mongoose.Types.ObjectId("5c34ac3d73b5db0ad42f5bbf"),
//     p_id: mongoose.Types.ObjectId("5c381472f8f7b327508b46b5")
//   });

//   article.save().then((e, d) => {
//     console.log(e, d);
//   });

// }

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


/*

db.articles.aggregate([
  {
    $match: {

    }
  },
  {
    $sort: { _id: -1 }
  },
  {
    $limit: 10
  },
  {
    $skip: 0
  },
  {
    $lookup: { // 左连接
      from: "users", // 关联到order表
      localField: "u_id", // user 表关联的字段
      foreignField: "_id", // order 表关联的字段
      as: "user"
    }
  },
  {
    $unwind: { // 拆分子数组
      path: "$user",
      preserveNullAndEmptyArrays: true // 空的数组也拆分
    }
  },

  {
    $lookup: { // 左连接
      from: "comments", // 关联到order表
      localField: "_id", // user 表关联的字段
      foreignField: "a_id", // order 表关联的字段
      as: "comments"
    }
  },
  {
    $project:{
      comment_size:{$size:"$comments"},
      _id:1,
      content:1,
      user:1,
      c_time:1
    }
  }
]).pretty();
*/