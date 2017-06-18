'use strict';

const WxPayHandler = require('../business/wxPay2');
const config = require('../config');
const url = require('url');
const querystring = require('querystring');
const LuckyRun = require('../business/luckyRun');
const Step = require('./Step.js');
const mongodb = require('mongodb');
const MongoClient = require("mongodb").MongoClient;
const DB_URL = config.mongodb_url;
var http = require('http');
var mongo = require('../business/mongodb_handles');

//const JSON = require('JSON')

module.exports = (req, response) =>
 {
        //能正确解析 json 格式的post参数
	    console.log("code=", req.body.code)
	    console.log("order=", req.body.order)
	    //console.log("data="+req.body.data.imgUrl)
	    //console.log("data="+req.body.data.name)
	    //console.log("data="+req.body.data.period)
        
//      var codedata = {"intime": Date.now(), "code": req.body.code}
//	    WxPayHandler.getOpenId(codedata, response)
        //LuckyRun.checkLuckyStatus()
    /*    
    MongoClient.connect(DB_URL, function (err, db) {
      if (err) {
        console.log(err)
      } else {
        var collection = db.collection('session');
        collection.find({}).toArray(function (err, result) {
          if (err) {
            console.log('Error:' + err);
            return
          } else {
            var openid= result[result.length-1]['openid']
            WxPayHandler.sendMsgForm(openid, null)
          }
          db.close();
        });
      }
    });
    */
    WxPayHandler.sendMsgForm(req.body.code, null)
        
        /**
          这部分 finalResponse 传参数进 WxPayHandler
        response.writeHead(200, {"Content-Type": "text/plain"});
        response.write("res end from order","utf8")
//        res.write(toCustomResign,"utf8")
        response.end();
        */
    };
