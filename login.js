'use strict';

const https = require('https');
const LoginService = require('qcloud-weapp-server-sdk').LoginService;
var MongoClient = require("mongodb").MongoClient;
var config = require('../config');

module.exports = (req, res) => {
    	var thatres = res
		console.log("\n客户端发起注册, req.query.code= " + req.query.code)
		var code = req.query.code
		var encryptedData = req.query.encryptedData
		var iv = req.query.iv
		var userinfo = req.query.userinfo
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
					"intime": Date.now(),
				}
				console.log(sessiondata)
				MongoClient.connect(config.mongodb_url, function (err, db) {
					if (err) {
						console.log(err)
					} else {
						var userinfo = db.collection("userinfo");
                        userinfo= JSON.parse(userinfo)
                        userinfo["logintime"]= Date.now()
                        console.log("userinfo= ", userinfo)
						collection.insertOne(userinfo, (err, result) => {
							if (err) {
								console.log('\nError:' + err);
								return
							} else {
                                //console.log("获得用户信息userinfo= ", result["ops"])
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