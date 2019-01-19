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
  // console.log(Count);

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
  ]);


});

Schema.static('page_size', async function ($where = {}, pageLen = 10) {


  const page_size = Math.ceil(((await this.countDocuments($where)) / pageLen));

  return page_size;

});

Schema.static('newArticles', async function (aLen = 6) {

  return await this.find({}).sort({ _id: -1 }).limit(aLen);

});

Schema.static('hotArticles', async function (aLen = 6) {

  return await this.find({}).sort({ hits: -1 }).limit(aLen);

});

Schema.static('OneArticle', async function (_id) {

  const currendArticle = await this.aggregate([
    {
      $match: {
        _id: mongoose.Types.ObjectId(_id)
      }
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
        content: 1,
        // article_size: { $count: 1 },
        user: 1,
        add_time: 1,
        a_img: 1,
        hits: 1,
        part: 1
      }
    }
  ]);

  return currendArticle && currendArticle.length && currendArticle[0];

});

Schema.static('search', async function (key) {
  const whele = {};

  if (key) {
    whele.title = {$regex:new RegExp(key)};
  }

  return await this.aggregate([
    {
      $match: whele
    },
    {
      $sort: { _id: -1 }
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
  ]);


});

const Articles = mongoose.model('Article', Schema);

module.exports = Articles;



// setTimeout(() => {
//   for (let index = 0; index < 40; index++) {
//     const article = new Articles({
//       title: index+" 新的 new Article Yes!!!",
//       content:index+ "新的 NWE INFO OOOOO!",
//       info: "文章内容",
//       u_id: mongoose.Types.ObjectId(["5c3ff208125d840a880054ab"][0]),
//       p_id: mongoose.Types.ObjectId(["5c4031b2587dd10e75897266","5c40319b68d3330e6be75ced"][Math.random()*3|0])
//     });

//     article.save().then((e, d) => {
//       console.log(e, d);
//     });

//   }
// }, 1000);

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