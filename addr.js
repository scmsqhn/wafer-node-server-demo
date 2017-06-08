'use strict';

const https = require('https');
const LoginService = require('qcloud-weapp-server-sdk').LoginService;
var MongoClient = require("mongodb").MongoClient;
var config = require('../config');

module.exports = (req, res) => {
        var finalres= res
		var addr = req.query.addr
		var options = encodeURI('http://japi.zto.cn/zto/api_utf8/baseArea?msg_type=GET_AREA&data='+addr)
		console.log("\n请求省市名称")
		https.get(options, (res) => {
			console.log('\n微信服务器返回 状态码：', res.statusCode);
			console.log('\n微信服务器返回 请求头：', res.headers);
			res.on('data', (d) => {
            console.log("\n获得地名: ", JSON.stringify(d))
            finalres.writeHeader(200, {'Content-Type': 'text/html;charset=utf-8', 'transfer-encoding': 'chunked'});
            finalres.end(JSON.stringify(d))
			});
		}).on('error', (e) => {
			console.error("获得地址信息错误\n ", e);
		});
};