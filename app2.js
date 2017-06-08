'use strict';

require('./globals');
require('./setup-qcloud-sdk');

const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const config = require('./config');
var path = require('path');
//var jade = require('jade');
var fs = require('fs');
var mongodb = require("mongodb");
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
//app.use("/images", express.static("/home/zean/uispider/images"));
// 打印异常日志
process.on('uncaughtException', error =>
 {
	console.log(error);
});

// 启动server
if (!module.parent) {
	http.createServer(app).listen(config.port, () =>
 {
		console.log('Express server listening on port: %s', config.port);
	});
}
