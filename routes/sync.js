var Step = require('./Step.js');
var config = require('../config')
var mongodb = require('mongodb')
var MongoClient = require("mongodb").MongoClient;
var DB_URL = config.mongodb_url

const goodsList = [{
		"goods": {
			"buyUnit": 1,
			"desc": "爆款老人机",
			"id": 1093,
			"imgUrl": "https://img14.360buyimg.com/n5/s54x54_jfs/t2317/302/996878454/224727/8368a723/563daf4eNbe7a411a.jpg",
			"imgUrl2": "https://img11.360buyimg.com/n9/s40x40_jfs/t1975/69/1097308100/161164/4c47eb18/563daf22N40d7b07f.jpg",
			"imgUrl3": "https://img12.360buyimg.com/n9/s40x40_jfs/t2461/272/990038759/205621/a0cca27/563daf2eN72bceb32.jpg",
			"imgUrl4": "https://img13.360buyimg.com/n9/s40x40_jfs/t2569/32/236948482/188449/54c801ac/563daf3fNfe796259.jpg",
			"name": "长虹老人机 GA958 双卡双待 移动4G 喜庆中国红",
			"tag": "ten"
		},
		"period": 100001,
		"takeRate": 0.10,
		"takeChances": 13,
		"totalChances": 129,
		"winner": "null"
	}, {
		"goods": {
			"buyUnit": 1,
			"desc": "颜色随机",
			"id": 348,
			"imgUrl": "http://res.126.net/p/dbqb/one/98/348/b73494078d526fcb5ead4201ec29daef.png",
			"imgUrl2": "http://res.126.net/p/dbqb/one/98/348/b73494078d526fcb5ead4201ec29daef.png",
			"imgUrl3": "http://res.126.net/p/dbqb/one/98/348/b73494078d526fcb5ead4201ec29daef.png",
			"name": "Apple Watch Sport 38毫米 铝金属表壳 运动表带",
			"tag": ""
		},
		"period": 211116207,
		"takeRate": 0.19,
		"takeChances": 632,
		"totalChances": 3288,
		"winner": "辛弃疾"
	}, {
		"goods": {
			"buyUnit": 1,
			"desc": "配备 Retina 显示器",
			"id": 510,
			"imgUrl": "http://res.126.net/p/dbqb/one/112/112/b246c1f56b1b10de718d21a6aa7349ac.png",
			"imgUrl2": "http://res.126.net/p/dbqb/one/112/112/b246c1f56b1b10de718d21a6aa7349ac.png",
			"imgUrl3": "http://res.126.net/p/dbqb/one/112/112/b246c1f56b1b10de718d21a6aa7349ac.png",
			"name": "Apple MacBook Pro 15.4英寸笔记本",
			"tag": ""
		},
		"period": 211116244,
		"takeRate": 0.26,
		"takeChances": 3760,
		"totalChances": 14288,
		"winner": "舒克贝塔"
	}, {
		"goods": {
			"buyUnit": 10,
			"desc": "超长续航 智能防盗",
			"id": 1168,
			"imgUrl": "http://res.126.net/p/dbqb/one/168/1168/6abc05894e903b9749166c224d739838.png",
			"name": "【预售】小牛电动N1电动踏板车 动力版 约11月20日发货",
			"tag": "ten"
		},
		"period": 211116256,
		"takeRate": 0.05,
		"takeChances": 300,
		"totalChances": 5990,
		"winner": "哪吒"
	}, {
		"goods": {
			"buyUnit": 1,
			"desc": "因工艺原因重量略有浮动",
			"id": 979,
			"imgUrl": "http://res.126.net/p/dbqb/one/229/979/defc72da941c4705fcdbb2a7ee03dbf1.png",
			"imgUrl2": "http://res.126.net/p/dbqb/one/112/112/b246c1f56b1b10de718d21a6aa7349ac.png",
			"imgUrl3": "http://res.126.net/p/dbqb/one/112/112/b246c1f56b1b10de718d21a6aa7349ac.png",
			"name": "周生生 黄金 足金旋转木马吊坠",
			"tag": ""
		},
		"period": 211116138,
		"takeRate": 0.17,
		"takeChances": 514,
		"totalChances": 2999,
		"winner": "朱耷"
	}, {
		"goods": {
			"buyUnit": 10,
			"desc": "颜色随机 支持专柜验货",
			"id": 673,
			"imgUrl": "http://res.126.net/p/dbqb/one/173/673/47c126b7bb39524d3d62151b2ef76629.png",
			"imgUrl2": "http://res.126.net/p/dbqb/one/112/112/b246c1f56b1b10de718d21a6aa7349ac.png",
			"imgUrl3": "http://res.126.net/p/dbqb/one/112/112/b246c1f56b1b10de718d21a6aa7349ac.png",
			"name": "Coach 蔻驰 抛光粒面皮革铆钉COACH CENTRAL手提包",
			"tag": "ten"
		},
		"period": 211115685,
		"takeRate": 0.13,
		"takeChances": 630,
		"totalChances": 4950,
		"winner": "李元吉"
	}, {
		"goods": {
			"buyUnit": 10,
			"desc": "颜色随机 美式奢侈生活风格的代表",
			"id": 943,
			"imgUrl": "http://res.126.net/p/dbqb/one/193/943/0994bfbd54c668fed6db160afd84eff4.png",
			"imgUrl2": "http://res.126.net/p/dbqb/one/112/112/b246c1f56b1b10de718d21a6aa7349ac.png",
			"imgUrl3": "http://res.126.net/p/dbqb/one/112/112/b246c1f56b1b10de718d21a6aa7349ac.png",
			"name": "MICHAEL KORS 迈克高仕 十字纹皮革钱包",
			"tag": "ten"
		},
		"period": 211114592,
		"takeRate": 0.45,
		"takeChances": 680,
		"totalChances": 1500,
		"winner": "程咬金"
	}, {
		"goods": {
			"buyUnit": 1,
			"desc": "吴晓波酿吴酒 一半清醒一半醉",
			"id": 1095,
			"imgUrl": "http://res.126.net/p/dbqb/one/95/1095/0176dd96dcc8b4188e6b2bbf85102304.png",
			"imgUrl2": "http://res.126.net/p/dbqb/one/112/112/b246c1f56b1b10de718d21a6aa7349ac.png",
			"imgUrl3": "http://res.126.net/p/dbqb/one/112/112/b246c1f56b1b10de718d21a6aa7349ac.png",
			"name": "【预售】吴酒 2016年贺年年酒 圣诞节开始派送",
			"tag": ""
		},
		"period": 211116226,
		"takeRate": 0.04,
		"takeChances": 7,
		"totalChances": 199,
		"winner": "mark"
	}, {
		"goods": {
			"buyUnit": 10,
			"desc": "珍贵绝伦",
			"id": 140,
			"imgUrl": "http://res.126.net/p/dbqb/one/140/140/ea7f0892ce49c332e2280513ee94a439.png",
			"imgUrl2": "http://res.126.net/p/dbqb/one/112/112/b246c1f56b1b10de718d21a6aa7349ac.png",
			"imgUrl3": "http://res.126.net/p/dbqb/one/112/112/b246c1f56b1b10de718d21a6aa7349ac.png",
			"name": "中国黄金 AU9999万足金50g薄片",
			"tag": "ten"
		},
		"period": 211116228,
		"takeRate": 0.95,
		"takeChances": 14200,
		"totalChances": 14990,
		"winner": "ken"
	}, {
		"goods": {
			"buyUnit": 10,
			"desc": "唯一的不同，是处处不同",
			"id": 1093,
			"imgUrl": "http://res.126.net/p/dbqb/one/93/1093/a9cf9389428aa00af8508727427cb1c5.png",
			"imgUrl2": "http://res.126.net/p/dbqb/one/112/112/b246c1f56b1b10de718d21a6aa7349ac.png",
			"imgUrl3": "http://res.126.net/p/dbqb/one/112/112/b246c1f56b1b10de718d21a6aa7349ac.png",
			"name": "【预售】Apple iPhone6s Plus 128G 颜色随机",
			"tag": "ten"
		},
		"period": 211116272,
		"takeRate": 0.01,
		"takeChances": 70,
		"totalChances": 8090,
		"winner": "spider-man"
	}
];

var resoutput = {};
var http = require('http');
var mongo = require('../business/mongodb_handles');
var config = require('../config');

var sync = {}
sync = {
	makeData: function (data) {
		jdata = JSON.stringify(data)
			console.log(jdata)
			resoutput = jdata
			console.log(resoutput)
	},
	findDataFromMongo: function (coll, data, cb) {
		console.log("mongo.queryData", coll, " : ", data)
		resoutput = mongo.queryData(config.mongodb_db, coll, data, cb)
			console.log("resoutput=")
			console.log(resoutput)
	},
	insertDataToMongo: function (coll, data, cb) {
		mongo.insertData(config.mongodb_db, coll, data, cb)
	},
	back(res) {
		resoutput = res
	},
	sendResponse(res, data) {
		res.writeHead(200, {
			'Content-Type': 'application/json'
		});
		res.end(data);
	}
}

module.exports = (req, res) => {
	console.log("sync 文件")
	console.log(req.query.code)
	console.log(req.query.item)
	console.log(req.query)
	var codedata = {
		"intime": Date.now(),
		"code": req.query.code,
		"item": req.query.item,
		"openid": req.query.openid,
		"data": req.query.data,
		"period": req.query.period,
	}
	//  console.log("req="+codedata)
	if (codedata.code == "1001") { //obtains goodsList
		MongoClient.connect(config.mongodb_url, function (err, db) {
			if (err) {
				console.log(err)
			} else {
                var querystatus= codedata.data
				console.log("mongo连接成功！");
				var collection = db.collection("goodsList");
                console.log("抽取条件=", querystatus)
				collection.find({}).toArray(function (err, result) {
					if (err) {
						console.log('\nError:' + err);
						return
					} else {
						var goodsList = JSON.stringify(result)
						console.log("\n读取宝贝信息返回成功: result= ", goodsList)
						res.writeHeader(200, {
								'Content-Type': 'application/json'
							});
						res.end(goodsList)
					}
				});
				db.close();
			}
		});
	}
	if (codedata.code == "1002") { //insert data
		console.log(codedata)
		for (var i in goodsList) {
			sync.insertDataToMongo("goodsList", goodsList[i], console.log)
		}
		res.writeHead(200, {
			'Content-Type': 'application/json'
		});
		res.end("insert OK");
	}
	if (codedata.code == "1003") {
		console.log("codedata", codedata)
		MongoClient.connect(config.mongodb_url, function (err, db) {
			if (err) {
				console.log(err)
			} else {
                var querystatus= codedata.openid
				console.log("mongo连接成功！");
				var collection = db.collection("buyhistory");
                console.log("抽取openid=", querystatus)
				collection.find({"OPENID":querystatus}).toArray(function (err, result) {
					if (err) {
						console.log('\nError:' + err);
						return
					} else {
						var buyhist = JSON.stringify(result)
						console.log("\n读取用户下单信息返回成功: result= ", buyhist)
						res.writeHeader(200, {
								'Content-Type': 'application/json'
							});
						res.end(buyhist)
					}
				});
				db.close();
			}
		});

	}
   	if (codedata.code == "1005") {
		console.log("codedata", codedata)
		MongoClient.connect(config.mongodb_url, function (err, db) {
			if (err) {
				console.log(err)
			} else {
                var querystatus= parseInt(codedata.period)
                console.log('1'+parseInt(codedata.period)+'1')
				console.log("MONGO 连接成功！");
				var collection = db.collection("goodsList");
                console.log("抽取PERIOD=", querystatus)
				collection.find({}).toArray(function (err, result) {
					if (err) {
						console.log('\nError:' + err);
						return
					} else {
						var buyhist = JSON.stringify(result)
						console.log("\n读取用户下单信息返回成功: result= ", buyhist)
						res.writeHeader(200, {
								'Content-Type': 'application/json'
							});
						res.end(buyhist)
					}
				});
				db.close();
			}
		});
	}
	//  console.log('listening on localhost:8080');
};
