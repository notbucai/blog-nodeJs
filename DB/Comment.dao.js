const mongoose = require('./dbUtlis.js');
/*

{
	_id:ObjectId,
	u_id:ObjectId,
	a_id:ObjectId,
	r_u_id:ObjectId,// 回复 ID
	content:String,
	c_ip:String,
	c_time:Date,
}

*/
const Schema = mongoose.Schema({
  u_id: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  a_id: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  r_u_id: {
    type: mongoose.Types.ObjectId,
    default: null,
  },
  content: {
    type: String,
    required: true,
    set(data) {
      return Buffer.from(data).toString("base64");
    }
  },
  c_ip: {
    type: String,
    default: null
  },
  c_time: {
    type: Date,
    default: Date.now,
  },
});


Schema.static('newComments', async function (cLen = 6) {

  return await this.aggregate([
    {
      $sort: { _id: -1 }
    },
    {
      $limit: cLen
    },
    {
      $lookup: {
        from: "users",
        localField: "u_id",
        foreignField: "_id",
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
      $lookup: {
        from: "articles",
        localField: "a_id",
        foreignField: "_id",
        as: "article"
      }
    },
    {
      $unwind: { // 拆分子数组
        path: "$article",
        preserveNullAndEmptyArrays: true // 空的数组也拆分
      }
    },
  ]);

});

Schema.static('a_idToComments', async function (a_id) {

  const comments = await this.aggregate([
    {
      $sort: {
        _id: -1
      }
    },
    {
      $match: {
        a_id: mongoose.Types.ObjectId(a_id)
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
      $lookup: { // 左连接
        from: "users", // 关联到order表
        localField: "r_u_id", // user 表关联的字段
        foreignField: "_id", // order 表关联的字段
        as: "p_user"
      }
    },
    {
      $unwind: { // 拆分子数组
        path: "$user",
        preserveNullAndEmptyArrays: true // 空的数组也拆分
      }
    },
    {
      $unwind: { // 拆分子数组
        path: "$p_user",
        preserveNullAndEmptyArrays: true // 空的数组也拆分
      }
    },
  ]);

  return comments;
});


Schema.static('addComment', async function (doc) {

  return doc.save();

});

Schema.static('getCommentsByUid', async function (u_id) {

  return await this.aggregate([
    {
      $sort: { _id: -1 }
    },
    {
      $match: {
        u_id: mongoose.Types.ObjectId(u_id)
      }
    },
    {
      $lookup: {
        from: "articles",
        localField: "a_id",
        foreignField: "_id",
        as: "article"
      }
    },
    {
      $unwind: { // 拆分子数组
        path: "$article",
        preserveNullAndEmptyArrays: true // 空的数组也拆分
      }
    },
  ]);

});

const Comment = mongoose.model('Comment', Schema);

module.exports = Comment;

const c = new Comment({
  u_id: mongoose.Types.ObjectId("5c3ff208125d840a880054ab"),
  r_u_id: mongoose.Types.ObjectId("5c3ff208125d840a880054ab"),
  a_id: mongoose.Types.ObjectId("5c4032205201840e8c407997"),
  content: "测试评论啦啦啦测试评论啦啦啦测试评论啦啦啦测试评论啦啦啦测试评论啦啦啦测试评论啦啦啦",
});

// c.save().then((a)=>{
//   console.log(a);
// });

// Comment.find().then((a) => {
//   console.log(a);
// });