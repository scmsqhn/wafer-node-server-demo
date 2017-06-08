'use strict';
const html =
	`<!DOCTYPE html>

<html>

<head>

    <meta charset="UTF-8">

    <title>
长虹手机微信小程序 Demo - Node.js</title>

    <style type="text/css">


    ::selection { background-color: #327F2D; color: white; }
    ::-moz-selection { background-color: #327F2D; color: white; }

    body {
        background-color: #fff;
        margin: 40px;
        font: 13px/20px normal Helvetica, Arial, sans-serif;
        color: #4F5155;
    }

    a {
        color: #003399;
        background-color: transparent;
        font-weight: normal;
        text-decoration: none;
    }

    h1 {
        color: #444;
        background-color: transparent;
        border-bottom: 1px solid #D0D0D0;
        font-size: 19px;
        font-weight: normal;
        margin: 0 0 14px 0;
        padding: 14px 0;
    }

    #container {
        margin: 10px;
        padding: 10px 20px;
        border: 1px solid #D0D0D0;
        box-shadow: 0 0 8px #D0D0D0;
    }
    </style>

</head>

<body>

    <div id="container">

        <h1>
腾讯云微信小程序服务端 Demo - Node.js</h1>

        <p>
会话管理服务</p>

        <ul>

            <li>
<a href="/login">
登录服务</a>
</li>

            <li>
<a href="/user">
检查登录</a>
</li>

        </ul>

        <p>
信道服务</p>

        <ul>

            <li>
<a href="/tunnel">
获得信道地址</a>
</li>

            <li>
<a href="/map">
获得地图界面</a>
</li>

            <li>
<a href="/yyg">
一元购</a>
</li>

            <li>
<a href="/aboutus">
捐赠</a>
</li>

        </ul>

    </div>

</body>

</html>

	`;


function $(Nid) {
	return document.getElementById(Nid);
}

const LoginService = require('qcloud-weapp-server-sdk').LoginService;

var http = require('http');
const https = require('https');

const options = {
  hostname: 'www.baidu.com',
  port: 443,
  path: '/',
  method: 'GET'
};

function testbaidu(options) {
	var finalres
	const req = https.request(options, (res) =>
 {
	  console.log('状态码：', res.statusCode);
	  console.log('请求头：', res.headers);
	  res.on('data', (d) =>
 {
		process.stdout.write(d);
	  });
	  finalres=res;
	});

	req.on('error', (e) =>
 {
	  console.error(e);
	});
	req.end();
	return finalres;
}

module.exports = (req, res) =>
 {
// res.send(testbaidu(options));
    res.redirect('http://map.baidu.com/?newmap=1&s=con%26wd%3D%E7%99%BE%E5%BA%A6%E5%9C%B0%E5%9B%BE+%E4%B8%8A%E6%B5%B7%E5%A4%96%E6%BB%A9%26c%3D289&from=alamap&tpl=mapdots');
			//	var objArray = getAddressPoint("上海外滩")
			//	LoginService.create(req, res).login();
	};
			//=====
			// add 16:37 2017/5/9 秦海宁

			/**
			 * 由地址获得经纬度wgs
			 */
			function getAddressPoint($address) {
			$lng = 0;
			$lat = 0;
			$url = 'http://api.map.baidu.com/geocoder?output=json&address='.urlencode($address);
			if (function_exists('curl_init')) {
				$ch = curl_init();
				curl_setopt($ch, CURLOPT_URL, $url);
				curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
				curl_setopt($ch, CURLOPT_HEADER, 0);
				$data = curl_exec($ch);
				curl_close($ch);
			} else {
				//		$data = file_get_contents($url, false, stream_context_create(array("http" =>
 array("method" =>
 "GET","timeout" =>
 1),)));
			}

			$data = json_decode($data, true);
			if ($data && $data['status'] == 'OK' && isset($data['result']) && isset($data['result']['location'])) {
				$lng = $data['result']['location']['lng'];
				$lat = $data['result']['location']['lat'];
			}
			return array($lng, $lat);
		}

			/**
			 * 逆地理编码专属请求
			 * User: Lg
			 * Date: 2016/4/11
			 * @param $address
			 * @return array
			 */

			//H:\wafer-node-server-demo-master\wafer-node-server-demo-master\routes\map.js

			function getAddress($lat, $lng) {
			$location = $lat + ',' + $lng;
			$url = 'http://api.map.baidu.com/geocoder?callback=renderReverse&location=' + $location + '&output=json&pois=1';
			if (function_exists('curl_init')) {
				$ch = curl_init();
				curl_setopt($ch, CURLOPT_URL, $url);
				curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
				curl_setopt($ch, CURLOPT_HEADER, 0);
				$data = curl_exec($ch);
				curl_close($ch);
			} else {
				//		$data = file_get_contents($url, false, stream_context_create(array(
				//						"http" =>
 array(
				//							"method" =>
 "GET",
				//							"timeout" =>
 1), )));
			}

			$data = json_decode($data, true);
			if ($data && $data['status'] == 'OK' && isset($data['result']) && isset($data['result']['addressComponent'])) {
				$province = $data['result']['addressComponent']['province'];
				$city = $data['result']['addressComponent']['city'];
				$district = $data['result']['addressComponent']['district'];
			}
			return array($province, $city, $district);
		}

			// 增加map获取数据功能
			//引入request
			/*
			var request = require('request'),
			fs = require('fs');

			var reqUrl = 'http://hotel.qunar.com/price/detail.jsp?fromDate=2012-08-18&toDate=2012-08-19&cityurl=shanghai_city&HotelSEQ=shanghai_city_2856&cn=5';

			request({
			uri: reqUrl
			}, function (err, response, body) {

			//console.log(response.statusCode);
			//console.log(response);

			//如果数据量比较大，就需要对返回的数据根据日期、酒店ID进行存储，如果获取数据进行对比的时候直接读文件
			var filePath = __dirname + '/data/data.js';

			if (fs.exists(filePath)) {
			fs.unlinkSync(filePath);

			console.log('Del file ' + filePath);
			}

			fs.writeFile(filePath, body, 'utf8', function (err) {
			if (err) {
			throw err;
			}

			console.log('Save ' + filePath + ' ok~');
			});

			console.log('Fetch ' + reqUrl + ' ok~');
			});
			*/
