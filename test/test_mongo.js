const http = require('http');
const hostname = '127.0.0.1';
const port = 3000;

'use strict';

var config = require('../config')
var mongodb = require('mongodb')
var MongoClient = require("mongodb").MongoClient;
var DB_URL = config.mongodb_url
	//var DB_URL = "//0.0.0.0:27017/";
var assert = require('assert');
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
	initMongoDB: function () {
		console.log("=initMongoDB")
		MongoClient.connect(DB_URL, function (error, db) {
			if (error) {
				console.log(error)
			} else {
				assert.equal(null, err);
				db.close();
			}
		});
	},
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
	deleteitem: function (db, coll, callback) {
		MongoClient.connect(DB_URL, function (err, db) {
			if (err) {
				console.log(err)
			} else {
				assert.equal(null, err);
				db.collection(coll).remove({"expires_in": 7200} , function (err, res) {
                    if(err){
                        console.log(err)
                    }else{
                        console.log(res.result.n)
                        console.log(res)
                    }
    				db.close();
				});
			}
		});

	},
	findall: function (db, coll, callback) {
		//连接到表
		MongoClient.connect(DB_URL, function (err, db) {
			if (err) {
				console.log(err)
			} else {
				assert.equal(null, err);
				var docs = {}
				db.collection(coll).find(function (err, cursor) {
					cursor.each(function (err, doc) {
						if (doc) {
							docs = {
								i: doc
							}
							console.log(doc)
							callback
							console.log('遍历所有文档成功');
						}
						callback
					})
				});
				db.close();
			}
		});
	},
	searchMsg: function (db, coll, whereStr) {
		//连接到表
		MongoClient.connect(DB_URL, function (err, db) {
            console.log("searchMsg")
			if (err) {
                console.log("searchMsg err="+err)
				console.log(err)
			} else {
                console.log("searchMsg else=OK")
				assert.equal(null, err);
				//在test库下blog集合中 新增json文档
				var i = 0
				var docs = {}
                console.log(whereStr)
				db.collection(coll).find(whereStr, function (err, cursor) {
					cursor.each(function (err, doc) {
                        console.log("cursor.each")
                        if(err){
                            console.log("ERR:"+err)
                            return -1
                        }else{
                            console.log("no err")
            				assert.equal(null, err);
                            console.log("assert right")
                            console.log(doc)
    						if (doc) {
                                console.log("===++++")
                                console.log("search SUCC")
                                console.log(doc.intime)
                                return doc
			    			}
                        }
					})
    				db.close();
				});
			}
		});
	},
	/**
	 * 查找session内容
	 * var whereStr= {"name": 'node'}
	 **/
	insertDocument: function (db, coll, data, callback) {
		console.log("insertDocument.data" + data)
		MongoClient.connect(DB_URL, function (err, db) {
			if (err) {
				console.log("insertDocument 报错: " + err)
				console.log("insertDocument err")
				console.log(err)
			} else {
				assert.equal(null, err);
				console.log("insertDocument 链接数据库成功")
				//在test库下blog集合中 新增json文档
				db.collection(coll, {
					safe: true
				}, function (err, coll) {
					console.log("insertDocument 获得数据库")
					console.log('get collection!');
					console.log(data)
					var ss = JSON.stringify(data);
					console.log("ss:" + ss)
					coll.insertOne({
						session_key: data.session_key,
						expires_in: 7200,
						openid: data.openid
					}, function (err, result) {
						console.log("insertDocument 数据库插入result:" + result)
						console.log("insertDocument 数据库插入data:" + data)
						console.log("insertDocument 数据库插入ss:" + ss)
						assert.equal(err, null);
						console.log('新增文档成功');
						callback(ss + "insert OK");
						db.close();
					});
				});
			}
		});
	},

	/**
	 * 插入奖品数据,以期为索引
	 **/
	insertGoodsData: function (db, data) {
		var coll = db.collection("goods");
		coll.insert(data, function (error, result) {
			if (error) {
				console.log('Error:' + error);
			} else {
				console.log(result.result.n);
			}
			db.close();
		});
	},

	/**
	 * 插入订单数据
	 **/
	insertOrderData: function (db, data) {
		var coll = db.collection("order");
		coll.insert(data, function (error, result) {
			if (error) {
				console.log('Error:' + error);
			} else {
				console.log(result.result.n);
			}
			db.close();
		});
	},

	/**
	 * 查找mongoDB内容
	 * 		var whereStr = {
	 *		"name": 'node'
	 *	};
	 **/
	searchGoodsMsg: function (db, whereStr, callback) {
		//连接到表
		var collection = db.collection('goods');
		//查询数据
		collection.find(whereStr, function (error, cursor) {
			cursor.each(function (error, doc) {
				if (doc) {
					//do sth here with callback
					callback(doc)
					//console.log(doc);
					/**
					 * if (doc.addTime) {
					 *    console.log("addTime: " + doc.addTime);
					 **/
				}
			});
		});
	},

	/**
	 * 查找mongoDB内容
	 * 		var whereStr = {
	 *		"name": 'node'
	 *	};
	 **/
	searchOrderMsg: function (db, whereStr, callback) {
		//连接到表
		var collection = db.collection('order');
		//查询数据
		collection.find(whereStr, function (error, cursor) {
			cursor.each(function (error, doc) {
				if (doc) {
					//do sth here with callback
					callback(doc)
					//console.log(doc);
					/**
					 * if (doc.addTime) {
					 *    console.log("addTime: " + doc.addTime);
					 **/
				}
			});
		});
	},

	//---更新
	updateData: function (db) {
		var devices = db.collection('vip');
		var whereData = {
			"name": "node"
		}
		var updateDat = {
			$set: {
				"age": 26
			}
		}; //如果不用$set，替换整条数据
		devices.update(whereData, updateDat, function (error, result) {
			if (error) {
				console.log('Error:' + error);
			} else {
				console.log(result);
			}
			db.close();
		});
	},

	//---删除
	deleteData: function (db) {
		var devices = db.collection('vip');
		var data = {
			"name": "node"
		};
		devices.remove(data, function (error, result) {
			if (error) {
				console.log('Error:' + error);
			} else {
				console.log(result.result.n);
			}
			db.close();
		})
	},

	/**
	 * 实现 onRequest 方法
	 * 在客户端请求 WebSocket 信道连接之后，
	 * 会调用 onRequest 方法，此时可以把信道 ID 和用户信息关联起来
	 */
	onRequest: function (tunnelId, userInfo) {
		debug(`${this.constructor.name} [onRequest] =>`, {
			tunnelId,
			userInfo
		});

		if (typeof userInfo === 'object') {
			// 保存 信道ID => 用户信息 的映射
			userMap[tunnelId] = userInfo;
		}
	},

	/**
	 * 实现 onConnect 方法
	 * 在客户端成功连接 WebSocket 信道服务之后会调用该方法，
	 * 此时通知所有其它在线的用户当前总人数以及刚加入的用户是谁
	 */
	onConnect: function (tunnelId) {
		debug(`${this.constructor.name} [onConnect] =>
`, {
			tunnelId
		});

		if (tunnelId in userMap) {
			connectedTunnelIds.push(tunnelId);

			$broadcast('people', {
				'total': connectedTunnelIds.length,
				'enter': userMap[tunnelId],
			});
		} else {
			debug(`Unknown tunnelId(${tunnelId}) was connectd, close it`);
			$close(tunnelId);
		}
	},

	/**
	 * 实现 onMessage 方法
	 * 客户端推送消息到 WebSocket 信道服务器上后，会调用该方法，此时可以处理信道的消息。
	 * 在本示例，我们处理 `speak` 类型的消息，该消息表示有用户发言。
	 * 我们把这个发言的信息广播到所有在线的 WebSocket 信道上
	 */
	onMessage: function (tunnelId, type, content) {
		debug(`${this.constructor.name} [onMessage] =>
`, {
			tunnelId,
			type,
			content
		});

		switch (type) {
		case 'speak':
			if (tunnelId in userMap) {
				$broadcast('speak', {
					'who': userMap[tunnelId],
					'word': content.word,
				});
			} else {
				$close(tunnelId);
			}
			break;

		default:
			// ...
			break;
		}
	}
}

var test={}
test={
    resSend: function(res,content){
        res.statusCode =200,
        res.setHeader('Content-Type', 'text/plain');
        res.end(content);
    },
	searchMsg: function (db, coll, whereStr, callback) {
		//连接到表
		MongoClient.connect(DB_URL, function (err, db) {
            console.log("searchMsg")
			if (err) {
                console.log("searchMsg err="+err)
				console.log(err)
			} else {
                console.log("searchMsg else=OK")
				assert.equal(null, err);
				//在test库下blog集合中 新增json文档
				var i = 0
				var docs = {}
                console.log(whereStr)
				db.collection(coll).find(whereStr, function (err, cursor) {
					cursor.each(function (err, doc) {
                        console.log("cursor.each")
                        if(err){
                            console.log("ERR:"+err)
                            return -1
                        }else{
                            console.log("no err")
            				assert.equal(null, err);
                            console.log("assert right")
                            console.log(doc)
    						if (doc) {
                                console.log("===++++")
                                console.log("search SUCC")
                                console.log(doc.intime)
                                callback
			    			}
                        }
					})
    				db.close();
				});
			}
		});
	},
}

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
//  test.searchMsg("admin","session", {'expires_in':7200})
});

server.listen(port, hostname, () => {
  console.log(`服务器运行在 http://${hostname}:${port}/`);
});