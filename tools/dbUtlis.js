const { MongoClient, ObjectID } = require('mongodb');
const { url, dbName } = require('../config/db.config.js');

// var url = "mongodb://localhost:27017/bucai";

// 使用新的解析器 useNewUrlParser

class DBUtlis {

  static ObjectID(id) {
    return ObjectID(id);
  }

  /**
   * 连接数据库
   */
  static async _connect() {
    return new Promise((resolve, reject) => {
      const ss = Date.now();

      MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
        console.log(err, client);

        if (err) { reject(err); return; }
        console.log(Date.now() - ss, " -");
        resolve([null, client]);

      });
    }).catch((error) => {
      return [error, null];
    })
  }

  /**
   * 查询多条
   * @param {String} doc_name 表名
   * @param {Object} where 条件
   */
  static async findDocuments(doc_name, { where = {}, thisArg = {}, skip = 0, limit = 0, sort = {} } = {}) {
    let result = null;
    console.log("===");

    const [err, client] = await DBUtlis._connect();
    console.log(client, "----", err);


    try {
      const ss = Date.now();
      if (err) throw err;

      const db = client.db(dbName);
      console.log(db);

      const collection = db.collection(doc_name);
      //.explain( "executionStats" )
      result = await collection.find(where, { projection: thisArg }).limit(limit).skip(skip).sort(sort).toArray();
      // console.log(where, thisArg);
      console.log(Date.now() - ss);


    } catch (error) {

      return [error, null]

    } finally {
      client.close();
    }
    return [null, result];
  }

  /**
   * 查询一条
   * @param {String} doc_name 表名
   * @param {Object} where 条件
   */
  static async findOneDocument(doc_name, where = {}) {
    let result = null;
    const [err, client] = await DBUtlis._connect();

    try {

      if (err) throw err;

      const db = client.db(dbName);

      const collection = db.collection(doc_name);

      result = await collection.findOne(where);


    } catch (error) {
      return [error, null]
    } finally {
      client.close();
    }
    return [null, result];
  }

  /**
   * 插入多条
   * @param {String} doc_name 表名
   * @param {Object} doc 插入的对象
   */
  static async insertDocuments(doc_name, docs = []) {
    let result = null;
    const [err, client] = await DBUtlis._connect();

    try {

      if (err) throw err;

      const db = client.db(dbName);

      const collection = db.collection(doc_name);

      result = await collection.insertMany(docs);

    } catch (error) {
      return [error, null]
    } finally {
      client.close();
    }
    return [null, result];
  }

  /**
   * 插入一条
   * @param {String} doc_name 表名
   * @param {Object} doc 插入的对象
   */
  static async insertOneDocument(doc_name, doc = {}) {
    let result = null;
    const [err, client] = await DBUtlis._connect();

    try {

      if (err) throw err;

      const db = client.db(dbName);

      const collection = db.collection(doc_name);

      result = await collection.insertOne(doc);

    } catch (error) {
      return [error, null]
    } finally {
      client.close();
    }
    return [null, result];
  }


  /**
   * 删除 一条
   * @param {String} doc_name 表名
   * @param {Object} where 条件
   */
  static async deleteOneDocument(doc_name, where = {}) {
    let result = null;
    const [err, client] = await DBUtlis._connect();

    try {

      if (err) throw err;

      const db = client.db(dbName);

      const collection = db.collection(doc_name);

      result = await collection.deleteOne(where);

    } catch (error) {
      return [error, null]
    } finally {
      client.close();
    }
    return [null, result];
  }

  /**
   * 删除 多条
   * @param {String} doc_name 表名
   * @param {Object} where 条件
   */
  static async deleteDocuments(doc_name, where = {}) {
    let result = null;
    const [err, client] = await DBUtlis._connect();

    try {

      if (err) throw err;

      const db = client.db(dbName);

      const collection = db.collection(doc_name);

      result = await collection.deleteMany(where);

    } catch (error) {
      return [error, null]
    } finally {
      client.close();
    }
    return [null, result];
  }

  /**
   * 更新多条
   * @param {String} doc_name 表
   * @param {Object} where 条件
   * @param {Object} update 更新数据
   * @param {Boolaen} multi 是否更新多行
   */
  static async updateDocuments(doc_name, where = {}, update) {

    let result = null;
    const [err, client] = await DBUtlis._connect();

    try {

      if (err) throw err;

      const db = client.db(dbName);

      const collection = db.collection(doc_name);

      result = await collection.updateMany(where, update);

    } catch (error) {
      return [error, null]
    } finally {
      client.close();
    }
    return [null, result];
  }

  /**
   * 更新一条
   * @param {String} doc_name 表
   * @param {Object} where 条件
   * @param {Object} update 更新数据
   * @param {Boolaen} multi 是否更新多行
   */
  static async updateOneDocument(doc_name, where = {}, update) {

    let result = null;
    const [err, client] = await DBUtlis._connect();

    try {

      if (err) throw err;

      const db = client.db(dbName);

      const collection = db.collection(doc_name);

      result = await collection.updateOne(where, update);

    } catch (error) {
      return [error, null]
    } finally {
      client.close();
    }
    return [null, result];
  }


  static async aggregateDocument(doc_name, group) {

    let result = null;
    const [err, client] = await DBUtlis._connect();

    try {

      if (err) throw err;

      const db = client.db(dbName);

      const collection = db.collection(doc_name);

      result = await collection.aggregate(group).toArray();

    } catch (error) {
      return [error, null]
    } finally {
      client.close();
    }
    return [null, result];
  }

}

function test() {
  DBUtlis.findDocuments("test").then((a) => {
    console.log(a);
  })
  DBUtlis.findOneDocument("test").then((a) => {
    console.log(a);
  })
  DBUtlis.insertOneDocument("test", { name: "123" }).then((a) => {
    console.log(a);
  })
  DBUtlis.insertDocuments("test", [{ name: "测试array" }, { name: "测试array3" }]).then((a) => {
    console.log(a);
  })
  DBUtlis.deleteDocuments("test", { name: "测试" }).then((a) => {
    console.log(a);
  })
  DBUtlis.deleteOneDocument("test", { name: "123" }).then((a) => {
    console.log(a);
  })

  DBUtlis.updateDocuments("test", { name: "测试array" }, { $set: { name: "不才222" } }).then((a) => {
    console.log(a);
  })
  DBUtlis.updateOneDocument("test", { name: "不才" }, { $set: { name: "----=-" } }).then((a) => {
    console.log(a);
  })
}

// test();

// DBUtlis.aggregateDocument('articles',[ {
//   $group: { _id: { $year: { "$add": [new Date(0), "$timestamp", 28800000] } }, 'count': { '$sum': 1 } }
// }]).then(([a,b])=>{
//   console.log(b);
// })

// DBUtlis.findDocuments("articles").then((a) => {
//   console.log(a);
// })

module.exports = DBUtlis;