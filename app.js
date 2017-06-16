'use strict';

require('./globals');
require('./setup-qcloud-sdk');

var schedule = require("node-schedule"); 

const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const config = require('./config');
var path = require('path');
//var jade = require('jade');
var fs = require('fs');
var mongodb = require("mongodb");
var LuckyRun = require('./business/luckyRun');
//var monk = require('monk');
//var db = monk('localhost:27017/data');
//H:\node-weapp-demo\app.js
const app = express();

app.set('query parser', 'simple');
app.set('case sensitive routing', true);
app.set('jsonp callback name', 'callback');
app.set('strict routing', true);
app.set('trust proxy', true);

app.disable('x-powered-by');

// 记录请求日志
app.use(morgan('tiny'));

// parse `application/x-www-form-urlencoded`
app.use(bodyParser.urlencoded({
		extended: true
	}));

// parse `application/json`
app.use(bodyParser.json());

app.use('/', require('./routes'));

// 打印异常日志
process.on('uncaughtException', error =>
 {
	console.log(error);
});

var rule3 = new schedule.RecurrenceRule();  
var times3 = [5,15,25,35,45,55]; //每隔10个单位
var times4 = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]; //每隔1个单位
//rule3.hour  = times4;  
rule3.hour  = times4;  
schedule.scheduleJob(rule3, function(){ 
  console.log("[*] 执行定时任务")
  LuckyRun.checkLuckyStatus();  
});
  
// 启动server
if (!module.parent) {
	http.createServer(app).listen(config.port, () =>
 {
		console.log('Express server listening on port: %s', config.port);
	});
}
