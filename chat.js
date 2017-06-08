const http = require('http');
const https = require('https');

function $(Nid) {
	return document.getElementById(Nid);
};

const html =
`<!DOCTYPE html>

<html>

<head>

<script>

function tuling(stringin){
	console.log("===")
	console.log("tuling in")
	console.log(stringin)
	var postData = {
		"perception": {
			"inputText": {
				"text": stringin
			},
			"selfInfo": {
				"location": {
					"city": "北京",
					"latitude": "39.45492",
					"longitude": "119.239293",
					"nearest_poi_name": "上地环岛南",
					"province": "北京",
					"street": "信息路"
				},
			}
		},
		"userInfo": {
			"apiKey": "e20d9bc75fac41eaa3903081e90948e1",
			"userId": "zean"
		}
	};

	var options = {
	  hostname: 'http://openapi.tuling123.com/openapi/api/v2',
	  port: 80,
	  path: '/upload',
	  method: 'POST',
	  headers: {
		'Content-Type': 'application/x-www-form-urlencoded',
		'Content-Length': Buffer.byteLength(postData)
	  }};

	var req = http.request(options, (res) =>
 {
	  res.setEncoding('utf8');
	  res.on('data', (chunk) =>
 {
		console.log($(chunk));
	  });
	  res.on('end', () =>
 {
		console.log('响应中已无数据。');
	  });
	});

	req.on('error', (e) =>
 {
	  console.log($(e.message));
	});

	// 写入数据到请求主体
	req.write(postData);
	req.end();
};	

</script>

</head>

<body>

c1: <input type="text" id="c1" value="">
<br>

s1: <input type="text" id="s1" value="您好,有什么可以为您做的?">
<br>
<br>

<input type="button" value="发出" onClick='tuling("123")'>

<p>
机器人客服测试</p>

</body>

</html>

`;


module.exports = (req, res) =>
 {
	/* console.log(html.c1)
	console.log(html.s1)
	console.log(req)
	console.log(req.header)
	console.log("res prepare") */
    res.send(html);
};