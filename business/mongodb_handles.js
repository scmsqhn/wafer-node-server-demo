'use strict';

var config = require('../config')
var mongodb = require('mongodb')
var MongoClient = require("mongodb").MongoClient;
var DB_URL = config.mongodb_url
  //var DB_URL = "//0.0.0.0:27017/";
  var assert = require('assert');
var server = new mongodb.Server('127.0.0.1', 27017, {
    auto_reconnect: true
  });
var db = new mongodb.Db('mydb', server, {
    safe: true
  });

/**
 * 数据库: ananfu 数据库 /data/db
 *   表格: buyhistory 下单历史 openid 主key
 *   表格: goodsList 商品名录 perioud 主key
 *   表格: loadrate 进度表格 peroud 主key
 **/

/**
 * 数据库数据格式
 * 表格1 业务表格:
 *  period: 211116272 期数
 *  goods:
 * 	  buyUnit 最小投注单位
 * 	  desc 产品描述
 * 	  id 期数,产品标示?
 * 	  imgUrl 图片位置 png 格式
 *  takerate: 0.01, 投注进度
 *  takechances: 70, 当前投注金额
 *  totalchances: 8090,  总投注金额
 *  winner: "铁木真" 得主
 *  datestart:开售时间
 *  dateend:开奖时间
 *
 * 表格2 订单表格:
 *  period: 211116272 期数
 *  order: 订单号{}
 *    orderNum:订单号
 *    orderTime:下单时间
 *    wxID:下单微信ID
 *    orderJine:下单金额
 *    period:下单期数,...等其他订单信息
 *
 ***/
var MongodbHandler = {}

//=== 操作数据库 mongodb
MongodbHandler = {
  //---初始化数据库
  makeGoodsData: function (period, buyUnit, desc, imgUrl, imgUrl2, imgUrl3, imgUrl4, takerate, takechances, totalchances, winner, datestart, dateend) {
    var data = {
      period: 0,
      goods: {
        buyUnit: 1,
        desc: "",
        imgUrl: "",
        imgUrl2: "",
        imgUrl3: "",
        imgUrl4: ""
      },
      takerate: 0,
      takechances: 0, //已经下注多少
      totalchances: 0, //有多少个下注机会,宝贝金额除buyUnit
      winner: "",
      datestart: "",
      dateend: ""
    }
    return data
  },
  makeOrderData: function (period, orderNum, orderTime, wxID, orderJine) {
    var data = {
      period: period,
      orderNum: orderNum,
      orderTime: orderTime,
      wxID: wxID,
      orderJine: orderJine
    }
    return data
  },
  //---查询
  queryData: function (db, col, whereStr, callback) {
    MongoClient.connect(DB_URL, function (err, db) {
      if (err) {
        console.log(err)
      } else {
        var collection = db.collection(col);
        console.log("COUNT=")
        //                console.log(collection.find(whereStr).count())
        collection.find(whereStr).toArray(function (err, result) {
          if (err) {
            console.log('Error:' + err);
            return
          } else {
            console.log("[x] db.result=", result)
            return result
            //    					callback(result);
          }
          db.close();
        });
      }
    });
  },
  //---删除
  deleteData: function (db, col, whereStr, callback) {
    MongoClient.connect(DB_URL, function (err, db) {
      if (err) {
        //////console.log(err)
      } else {
        //////console.log("连接成功！");
        var collection = db.collection(col);
        collection.remove(whereStr, function (err, result) {
          if (err) {
            console.log('FAIL delete');
            console.log('Error:' + err);
            return;
          } else {
            callback(result);
          }
          db.close();
        });
      }
    });
  },
  //---插入数据
  insertData: function (db, col, data, callback) {
    MongoClient.connect(DB_URL, function (err, db) {
      if (err) {
        console.log(err)
      } else {
        console.log("连接成功！");
        var collection = db.collection(col);
        collection.insert(data, function (err, result) {
          if (err) {
            console.log('Error:' + err);
            return;
          }
          callback(result);
          db.close();
        });
      }
    });
  },
  updateData: function (db, col, data, callback) {
    MongoClient.connect(DB_URL, function (err, db) {
      if (err) {
        console.log(err)
      } else {
        var collection = db.collection(col);
        collection.update(data, function (err, result) {
          if (err) {
            console.log('Error:' + err);
            return;
          }
          callback(result);
          db.close();
        });
      }
    });
  },
}

module.exports = MongodbHandler;
