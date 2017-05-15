'use strict';

const WxPayHandler = require('../business/wxPay2');
const config = require('../config');

module.exports = (req, response) => {
    console.log("order.js\n")
    console.log("req="+req.body)
    response.writeHead(200, {"Content-Type": "text/plain"});    
    console.log("init wxpay")
    var wxpay = new WxPayHandler();
    console.log("order.js new wxpay")
    console.log("config,req.data.code=="+config,req.body.code)
    //body包括 code period jine
    //code 用来换取openID, period是订单信息,json格式,包含{period:jine}期数和金额,
    flagdata=wxpay.getOpenId(config, req.body)
    response.write(flagdata,"utf8")
    response.end();
    console.log("order.js new wxpay")
    console.log("get the order")
};
