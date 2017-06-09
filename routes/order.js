'use strict';

const WxPayHandler = require('../business/wxPay2');
const config = require('../config');
const url = require('url')
const querystring = require('querystring')
const LuckyRun = require('../business/luckyRun');
//const JSON = require('JSON')

module.exports = (req, response) =>
 {
        //能正确解析 json 格式的post参数
	    console.log("code="+req.body.code)
	    //console.log("data="+req.body.data.imgUrl)	
	    //console.log("data="+req.body.data.name)
	    //console.log("data="+req.body.data.period)
        
//        var codedata = {"intime": Date.now(), "code": req.body.code}
//	    WxPayHandler.getOpenId(codedata, response)
        LuckyRun.getTheLuckyNumber(100)
        /**
          这部分 finalResponse 传参数进 WxPayHandler
        response.writeHead(200, {"Content-Type": "text/plain"});
        response.write("res end from order","utf8")
//        res.write(toCustomResign,"utf8")
        response.end();
        */
    };
