'use strict';
const TunnelService = require('qcloud-weapp-server-sdk').TunnelService;
/**
 * 调用 TunnelService.broadcast() 进行广播
 * @param  {String} type    消息类型
 * @param  {String} content 消息内容
 */
const $broadcast = (type, content) => {
	TunnelService.broadcast(connectedTunnelIds, type, content)
	.then(result => {
		let invalidTunnelIds = result.data && result.data.invalidTunnelIds || [];
		if (invalidTunnelIds.length) {
			debug('检测到无效的信道 IDs =>', invalidTunnelIds);
			// 从`userMap`和`connectedTunnelIds`中将无效的信道记录移除
			invalidTunnelIds.forEach(tunnelId => {
				delete userMap[tunnelId];
				let index = connectedTunnelIds.indexOf(tunnelId);
				if (~index) {
					connectedTunnelIds.splice(index, 1);
				}
			});
		}
	});
};
/**
 * 调用 TunnelService.closeTunnel() 关闭信道
 * @param  {String} tunnelId 信道ID
 */
const $close = (tunnelId) => {
	TunnelService.closeTunnel(tunnelId);
};
// 保存 WebSocket 信道对应的用户
// 在实际的业务中，应该使用数据库进行存储跟踪，这里作为示例只是演示其作用
let userMap = {};
// 保存 当前已连接的 WebSocket 信道ID列表
let connectedTunnelIds = [];
/**
 * 实现 WebSocket 信道处理器
 * 本示例配合客户端 Demo 实现一个简单的聊天室功能
 */
const mongodb = require('mongodb')
const MongoClient = require("mongodb").MongoClient;
const DB_URL = "mongodb://localhost:27017/";
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
 
//=== 操作数据库 mongodb
class MongodbHandler {
    
	//---初始化数据库
	function initMongoDB(flag) {
		MongoClient.connect(DB_URL, function (error, db) {
			console.log('连接成功!');
            return db
			// or u ccan do sth here like this below 
			// insertData(db);
		});
	}
    
    function makeGoodsData(period,buyUnit,desc,imgUrl,imgUrl2,imgUrl3,imgUrl4,takerate,takechances,totalchances,winner,datestart,dateend){
        var data= {
            period: 0,
            goods:{
                buyUnit:1,
                desc: "",
                imgUrl: "",
                imgUrl2: "",
                imgUrl3: "",
                imgUrl4: ""
            },
            takerate: 0,
            takechances: 0,//已经下注多少
            totalchances: 0,//有多少个下注机会,宝贝金额除buyUnit
            winner: "",
            datestart: "",
            dateend: ""
        }
        return data
    }
    
    function makeOrderData(period,orderNum,orderTime,wxID,orderJine){
        var data= {
            period: period,
            orderNum: orderNum,
            orderTime: orderTime,
            wxID: wxID,
            orderJine: orderJine
            }
        return data
    }
    
    
    /**
     * 插入奖品数据,以期为索引
     **/
	function insertGoodsData(db, data) {
		var coll = db.collection("goods");
		coll.insert(data, function (error, result) {
			if (error) {
				console.log('Error:' + error);
			} else {
				console.log(result.result.n);
			}
			db.close();
		});
	}
    
    /**
     * 插入订单数据
     **/
   	function insertOrderData(db, data) {
		var coll = db.collection("order");
		coll.insert(data, function (error, result) {
			if (error) {
				console.log('Error:' + error);
			} else {
				console.log(result.result.n);
			}
			db.close();
		});
	}
    
    /**
     * 查找mongoDB内容
     * 		var whereStr = {
	 *		"name": 'node'
	 *	};
     **/
	function searchGoodsMsg(db, whereStr, callback) {
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
    }
    
        /**
     * 查找mongoDB内容
     * 		var whereStr = {
	 *		"name": 'node'
	 *	};
     **/
	function searchOrderMsg(db, whereStr, callback) {
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
    }

	//---更新
	function updateData(db) {
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
	}

	//---删除
	function deleteData(db) {
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
	}

	/**
	 * 实现 onRequest 方法
	 * 在客户端请求 WebSocket 信道连接之后，
	 * 会调用 onRequest 方法，此时可以把信道 ID 和用户信息关联起来
	 */
	onRequest(tunnelId, userInfo) {
		debug(`${this.constructor.name} [onRequest] =>`, {
			tunnelId,
			userInfo
		});

		if (typeof userInfo === 'object') {
			// 保存 信道ID => 用户信息 的映射
			userMap[tunnelId] = userInfo;
		}
	}

	/**
	 * 实现 onConnect 方法
	 * 在客户端成功连接 WebSocket 信道服务之后会调用该方法，
	 * 此时通知所有其它在线的用户当前总人数以及刚加入的用户是谁
	 */
	onConnect(tunnelId) {
		debug(`${this.constructor.name} [onConnect] =>`, {
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
	}

	/**
	 * 实现 onMessage 方法
	 * 客户端推送消息到 WebSocket 信道服务器上后，会调用该方法，此时可以处理信道的消息。
	 * 在本示例，我们处理 `speak` 类型的消息，该消息表示有用户发言。
	 * 我们把这个发言的信息广播到所有在线的 WebSocket 信道上
	 */
	onMessage(tunnelId, type, content) {
		debug(`${this.constructor.name} [onMessage] =>`, {
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

module.exports = MongodbHandler;
