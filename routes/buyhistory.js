'use strict';

const https = require('https');
const LoginService = require('qcloud-weapp-server-sdk').LoginService;
var MongoClient = require("mongodb").MongoClient;
var config = require('../config');
var goodsList = [{}]

module.exports = (req, res) => {
	var thatres = res
		console.log("\n客户端发起注册, req.query.code= " + req.query.code)
		var code = req.query.code
        
	};
