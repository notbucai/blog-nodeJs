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
    default: null
  },
  content: {
    type: String,
    required: true,
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


const Comment = mongoose.model('Comment', Schema);

module.exports = Comment;

// const c = new Comment({
//   u_id:mongoose.Types.ObjectId("5c3cca8bde5fd316cdbe63fb"),
//   a_id:mongoose.Types.ObjectId("5c3d375ca646331871b89820"),
//   content:"测试评论啦啦啦测试评论啦啦啦测试评论啦啦啦测试评论啦啦啦测试评论啦啦啦测试评论啦啦啦",
// });

// c.save().then((a)=>{
//   console.log(a);
// });

// Comment.find().then((a) => {
//   console.log(a);
// });