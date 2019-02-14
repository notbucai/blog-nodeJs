const mongoose = require('./dbUtlis.js');

const Schema = mongoose.Schema({
  u_id: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  f_u_id: {
    type: mongoose.Types.ObjectId,
    required: true,
  }
});

// 获取我关注的
Schema.static('getMeAFocus', async function (u_id) {
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
        from: "users",
        localField: "f_u_id",
        foreignField: "_id",
        as: "f_user"
      }
    },
    {
      $unwind: { // 拆分子数组
        path: "$f_user",
        preserveNullAndEmptyArrays: true // 空的数组也拆分
      }
    },
  ]);
});

// 获取关注我的
Schema.static('getToFocusMe', async function (u_id) {
  return await this.aggregate([
    {
      $sort: { _id: -1 }
    },
    {
      $match: {
        f_u_id: mongoose.Types.ObjectId(u_id)
      }
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
  ]);
});

// 关注
Schema.static('focusUser', async function (doc) {

  const isfocus = await this.isFocusUser(doc);

  if (isfocus) {
    return false;
  }
  await doc.save();

  return true;
});

// 是否关注
Schema.static('isFocusUser', async function (doc) {
  const { u_id, f_u_id } = doc;

  const isfocus = await this.findOne({ u_id, f_u_id });

  if (isfocus) {
    return true;
  }

  return false;
});

// 取消关注
Schema.static('unFocusUser', async function (doc) {
  const { u_id, f_u_id } = doc;

  await this.remove({
    u_id, f_u_id
  });

  return true;
});

const Focus = mongoose.model('focus', Schema);

module.exports = Focus;

// Focus.focusUser(new Focus({
//   u_id: "5c641fa91dd70e1d2759e7a4",
//   f_u_id: "5c3ff208125d840a880054ab"
// }))

// Focus.getToFocusMe("5c641fa91dd70e1d2759e7a4").then((doc)=>{
//   console.log(JSON.stringify(doc,null,2));
  
// });