// route/file.js
'use strict';

const https = require('https');
const LoginService = require('qcloud-weapp-server-sdk').LoginService;
var MongoClient = require("mongodb").MongoClient;
var config = require('../config');

const fs = require("fs");
const http = require("http");
const url = require("url");
const path = require("path");
const mime = require("./mime").mime;
const util = require('util');

//www根目录
var root = __dirname,
host = "127.0.0.1",
port = "8888";

var fileUtils = {
	//显示文件夹下面的文件
	listDirectory: function (parentDirectory, req, res) {
		fs.readdir(parentDirectory, function (error, files) {
			var body = formatBody(parentDirectory, files);
			res.writeHead(200, {
				"Content-Type": "text/html;charset=utf-8",
				"Content-Length": Buffer.byteLength(body, 'utf8'),
				"Server": "NodeJs(" + process.version + ")"
			});
			res.write(body, 'utf8');
			res.end();
		});

	},

	//显示文件内容
	showFile: function (file, req, res) {
		fs.readFile(file, 'binary', function (err, file) {
			var contentType = mime.lookupExtension(path.extname(file));
			console.log('contentType= ', contentType)
			res.writeHead(200, {
				"Content-Type": contentType,
				"Content-Length": Buffer.byteLength(file, 'binary'),
				"Server": "NodeJs(" + process.version + ")"
			});
			res.write(file, "binary");
			res.end();
			//console.log('发送图片回Client: ', res)
		})
	},

	//在Web页面上显示文件列表，格式为<ul><li></li><li></li></ul>
	formatBody: function (parent, files) {
		var res = [],
		length = files.length;
		res.push("<!doctype>");
		res.push("<html>");
		res.push("<head>");
		res.push("<meta http-equiv='Content-Type' content='text/html;charset=utf-8'></meta>")
		res.push("<title>Node.js文件服务器</title>");
		res.push("</head>");
		res.push("<body width='100%'>");
		res.push("<ul>")
		files.forEach(function (val, index) {
			var stat = fs.statSync(path.join(parent, val));
			if (stat.isDirectory(val)) {
				val = path.basename(val) + "/";
			} else {
				val = path.basename(val);
			}
			res.push("<li><a href='" + val + "'>" + val + "</a></li>");
		});
		res.push("</ul>");
		res.push("<div style='position:relative;width:98%;bottom:5px;height:25px;background:gray'>");
		res.push("<div style='margin:0 auto;height:100%;line-height:25px;text-align:center'>Powered By Node.js</div>");
		res.push("</div>")
		res.push("</body>");
		return res.join("");
	},

	//如果文件找不到，显示404错误
	write404: function (req, res) {
		var body = "文件不存在:-(";
		res.writeHead(404, {
			"Content-Type": "text/html;charset=utf-8",
			"Content-Length": Buffer.byteLength(body, 'utf8'),
			"Server": "NodeJs(" + process.version + ")"
		});
		res.write(body);
		res.end();
	},
}

module.exports = (req, res) => {
	var finalres = res
		var code = req.query.code
		var filename = req.query.filename
		var filestyle = filename.split('.')[1]
		console.log("\n客户端申请获得资源文件, req.query.code= ", req.query.code, "\nreq.query.filename= ", req.query.filename, "\nreq.query.filestyle= ", filename.split('.')[1], filename.split('.')[0])
		var root = '/data/release/node-weapp-demo/resource/';
	filename = root + filename;
	console.log('filename is ', filename)
	var exists = fs.existsSync(filename)
		if (!exists) {
			console.log('找不到文件' + filename);
			fileUtils.write404(req, finalres);
		} else {
			fileUtils.showFile(filename, req, finalres);
		}
}
