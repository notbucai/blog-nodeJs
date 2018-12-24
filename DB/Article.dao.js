const DBUtlis = require('../tools/dbUtlis');

const doc_name = "articles";

const addArticle = async ({
  title, content, info, timestamp = Date.now(), end_timestamp = Date.now()
}) => {
  let res = null;

  try {

    if (!title || !content || !info) throw new Error("参数错误");

    const [error, result] = await DBUtlis.insertOneDocument(doc_name, { title, content, info, timestamp, end_timestamp });

    if (error) throw error;
    console.log(result);

    res = [null, { ...result.result, insertedId: result.insertedId }];
  } catch (error) {
    res = [error, null];
  }
  return res;

}

const deleteArticle = async (_id) => {
  let res = null;
  try {

    const [error, result] = await DBUtlis.deleteOneDocument(doc_name, { _id: DBUtlis.ObjectID(_id) });

    if (error) throw error;

    res = [null, result.deletedCount];

  } catch (error) {
    res = [error, null];
  }

  return res;
}

const findToIdArticle = async (_id) => {
  let res = null;
  try {

    const [error, result] = await DBUtlis.findOneDocument(doc_name, {
      where: { _id: DBUtlis.ObjectID(_id) }
    });

    if (error) throw error;

    res = [null, result];

  } catch (error) {
    res = [error, null];
  }

  return res;
}

const findAllArticle = async () => {
  let res = null;
  try {

    const [error, result] = await DBUtlis.findDocuments(doc_name);

    if (error) throw error;

    res = [null, result];

  } catch (error) {
    res = [error, null];
  }

  return res;
}

const findScopeArticle = async (limit, skip) => {
  let res = null;
  try {

    const [error, result] = await DBUtlis.findDocuments(doc_name, {
      limit, skip, sort: { timestamp: -1 },
      thisArg: {
        end_timestamp: 0,
        content: 0
      }
    });

    if (error) throw error;

    res = [null, result];

  } catch (error) {
    res = [error, null];
  }

  return res;
}

const findAllYearGroupArticle = async () => {
  let res = null;
  let end_res = {};
  try {

    const [error, result] = await DBUtlis.aggregateDocument(doc_name, [{
      $group: { _id: { $year: { "$add": [new Date(0), "$timestamp", 28800000] } }, 'count': { '$sum': 1 } }
    }]);

    if (error) throw error;

    const yearList = result.sort((a, b) => {
      return parseInt(b._id) - parseInt(a._id);
    })


    for (const item of yearList) {
      const { _id, count } = item;

      const [e, r] = await DBUtlis.findDocuments(doc_name, {
        where: {
          timestamp: {
            "$gte": new Date(`${_id}-01-01`).getTime()
            ,
            "$lt": new Date(`${_id}-12-31`).getTime()
          }
        }
      });
      if (e) continue;

      end_res[_id] = {
        count,
        list: r
      }

    }

    if (error) throw error;
    // console.log(result);

    res = [null, end_res];

  } catch (error) {
    res = [error, null];
  }

  return res;
}

const updateOneArticle = async ({
  _id, title, content, info
}) => {
  const end_timestamp = Date.now();
  let res = null;

  try {

    const [error, result] = await DBUtlis.updateOneDocument(doc_name, { _id: DBUtlis.ObjectID(_id) }, {
      $set: {
        title, content, info, end_timestamp
      }
    });

    if (error) throw error;

    res = [null, result.result];

  } catch (error) {
    res = [error, null];
  }

  return res;
}

module.exports = {
  updateOneArticle,
  findScopeArticle,
  findAllArticle,
  findToIdArticle,
  deleteArticle,
  addArticle,
  findAllYearGroupArticle
}

// __________________测试_____________________
let s = Date.now();

addArticle({
  title: "测试标题",
  content: "测试内容",
  info: "测试简介",
  timestamp:1487635200000
}).then((a) => {
  console.log(a);
});
// addArticle({
//   title: "测试标题",
//   content: "测试内容",
//   info: "测试简介",
//   timestamp:1298246400000
// }).then((a) => {
//   console.log(a);
// });


// 5c1b3d1ef8214421a056051a
// console.log(DBUtlis.ObjectID("5c1b3d1ef8214421a056051a"));

// deleteArticle("5c1b3d1ef8214421a056051a");
// ObjectId("5c1b3f2add711e2f286ae612"), 

// findToIdArticle("5c1b3f2add711e2f286ae612").then((a) => {
//   console.log(a);
//   console.log(Date.now() - s);
// })
// ObjectId("5c1b3f332ca50e2274825f56"),
findAllArticle().then((a) => {
  console.log(a);

  console.log(Date.now() - s);
})
// updateOneArticle({
//   _id: "5c1b3f332ca50e2274825f56",
//   title: "测试修改标题",
//   content: "测试修改内容",
//   info: "测试修改简介"
// }).then((a) => {
//   console.log(a);
// });

// findScopeArticle(10, 0).then((a) => {
//   console.log(a);
// });
// findAllYearGroupArticle().then((a) => {
//   console.log(a);
//   console.log(Date.now() - s);
// });


