'use strict';

function $(Nid) {
	return document.getElementById(Nid);
};

const LoginService = require('qcloud-weapp-server-sdk').LoginService;

var http = require('http');
const https = require('https');

const options = {
  hostname: 'www.baidu.com',
  port: 443,
  path: '/',
  method: 'GET'
};

function aikf(options) {
	var finalres
	const req = https.request(options, (res) => {
	  console.log('状态码：', res.statusCode);
	  console.log('请求头：', res.headers);
	  res.on('data', (d) => {
		process.stdout.write(d);
	  });
	  finalres=res;
	});

	req.on('error', (e) => {
	  console.error(e);
	});
	req.end();
	return finalres;
};

module.exports = (req, res) => {
//    aikf(options);
    console.log("===")
    console.log(req.statusCode)
    console.log("===")
    console.log(req.headers)
	res.writeHead(200)
	res.end('hello world\n')
	};
