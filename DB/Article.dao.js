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

Schema.static('hitsIncById', async function (_id) {
  // 必须同步才会执行
  await this.updateOne({
    _id: mongoose.Types.ObjectId(_id)
  }, {
      '$inc': {
        hits: 1
      }
    });

});

Schema.static('page', async function (p_id, index, pageSize = 10, where = {}) {
  let Count = index * pageSize;

  if (p_id) {
    where.p_id = mongoose.Types.ObjectId(p_id);
  }

  return await this.aggregate([
    {
      $match: where
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
        from: "parts",
        localField: "p_id",
        foreignField: "_id",
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
    { // 允许出现的字段
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

Schema.static('count', async function ($where = {}, pageLen = 10) {


  const count = await this.countDocuments($where);

  return count;

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
    whele.title = { $regex: new RegExp(key) };
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

Schema.static('removeById', async function (_id) {
  await this.deleteOne({ _id });
});


Schema.static('addAndUpdate', async function (doc) {

  await this.updateOne({
    _id: doc._id
  }, doc, {
      upsert: true
    });

});


const Articles = mongoose.model('Article', Schema);

module.exports = Articles;

