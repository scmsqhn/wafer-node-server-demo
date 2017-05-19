'use strict';
const https = require('https');
const LoginService = require('qcloud-weapp-server-sdk').LoginService;
var MongoClient = require("mongodb").MongoClient;

module.exports = (req, res) =>
{
    console.log("\n客户端发起注册, req.query.code= " + req.query.code)
    var code= req.query.code
    var options= encodeURI('https://api.weixin.qq.com/sns/jscode2session?appid=wx56df671c2e5c8bb7&secret=e6aa6023ff0b180b05b9c2270fb7cf81&js_code=' + code + '&grant_type=authorization_code/')
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
            MongoClient.connect(config.mongodb_url, function(err, db){
			if (err) {
				console.log(err)
			} else {
                console.log("mongo连接成功！");
				var collection = db.collection("buylist");
                console.log("COUNT=")
				collection.find({openid: sessiondata.openid}).toArray(function (err, result) {
					if (err) {
						console.log('Error:' + err);
                        return
					}else{
                        console.log('result')
                        console.log(result)
                   		res.writeHead(200, {'Content-Type': 'application/json'});
                        console.log("读取返回成功: ", result)
                		res.end({'a':'b', 'b':'c','c':'d'});//result);
                    }
                    db.close();
				});
			}
		});

    	});
	}).on('error', (e) => {
		console.error("获得openid错误\n ", e);
	});
};