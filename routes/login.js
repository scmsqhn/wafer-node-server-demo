'use strict';
const https = require('https');
const LoginService = require('qcloud-weapp-server-sdk').LoginService;
var MongoClient = require("mongodb").MongoClient;
var config = require('../config');
var goodsList = [{
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
	}
]

module.exports = (req, res) => {
	var thatres = res
		console.log("\n客户端发起注册, req.query.code= " + req.query.code)
		var code = req.query.code
		var options = encodeURI('https://api.weixin.qq.com/sns/jscode2session?appid=wx56df671c2e5c8bb7&secret=e6aa6023ff0b180b05b9c2270fb7cf81&js_code=' + code + '&grant_type=authorization_code/')
		console.log("\n业务服务器向微信发起请求请求session_key和openid: " + options)
		https.get(options, (res) => {
			console.log('\n微信服务器返回 状态码：', res.statusCode);
			console.log('\n微信服务器返回 请求头：', res.headers);
			res.on('data', (d) => {
				var e = JSON.parse(d)
					var sessiondata = {
					"session_key": e.session_key,
					"openid": e.openid,
					"intime": Date.now()
				}
				console.log(sessiondata)
				MongoClient.connect(config.mongodb_url, function (err, db) {
					if (err) {
						console.log(err)
					} else {
						console.log("mongo连接成功！");
						var collection = db.collection("buyhistory");
						collection.find().toArray(function (err, result) {
							if (err) {
								console.log('\nError:' + err);
								return
							} else {
                                var goodsList = JSON.stringify(result)
								console.log("\n读取商品信息返回成功: result= ",goodsList)
                                thatres.writeHeader(200, {'Content-Type':'application/json'});
                                thatres.end(goodsList)
							}
						});
    					db.close();
					}
				});
			});
	    }).on('error', (e) => {
		console.error("获得openid错误\n ", e);
	});
	};
