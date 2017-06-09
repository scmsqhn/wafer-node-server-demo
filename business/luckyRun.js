'use strict';

const https = require('https');
const config = require('../config');
const MongodbHandler = require('../business/mongodb_handles');
const request = require("request");
//2小时过期时间，60*60*2
var expireTime = 7200000;

// 频繁访问限制,保存每次申请内容,使用mongoDB,不再使用var
/**
 *  var sessionData={
 *   "session_key":"hULnAWfL3CNLoGCw9Nx21g==",
 *   "expires_in":7200,
 *   "openid":"o44Xt0ESHNe6SSyVL9aP6B_noTdY"
 *  }
 **/
var LuckyRun
var openID = ""
var basetime = -1
var myopenid = ""

LuckyRun = {
	constructor: function (name) {
		this.name = name;
		//console.log("new WxPayHandler()")
	},
	getTheLuckyNum: function (large) {
        r = random.randint(0,large)
        console.log('# r =', r)
	},
	getintime(injson) {
		try {
			var parsejson = injson[0].openid
				myopenid = parsejson
				console.log("[*] 2小时内,获得OPENID = ", myopenid)
		} catch (e) {
			console.log("[*] ", e)
		}
	},
	TimePassed: function (data, callback) {
		//true: use  install data
		//false: re-get new data
		//console.log("TimePassed()" + data)
		MongodbHandler.queryData("ananfu", "session", data, callback)
	},
	getOpenId: function (body, finalResponse) {
		console.log('[*] 执行getOpenId')
		var code = body.code
			//var intime = body.intime
			//console.log("code=" + code)
			console.log("[*] 判断时间间隔basetime=>", basetime, "Date.now=>", Date.now())
			if (Date.now() - basetime < 7200000) {
				console.log("time is not passed, obtain from sessionData\n")
				this.TimePassed({
					'expires_in': 7200
				}, this.getintime)
				console.log("[*] 从数据库取 myopenid = ", myopenid)
				if (this.getintime["openid"] == null) {
					console.log("[*] 2小时内获得 openid=undefine,重新获得")
					basetime = -1
						this.getOpenId(body, finalResponse)
				} else {
					this.getWeChatPayid(null, null, myopenid, null, null, null, null, null, null, finalResponse)
				}
			} else {
				console.log('[*] 时间超过2小时')
				console.log("basetime=", basetime)
				console.log("[*] time is passed, obtain new openID\n")
				MongodbHandler.deleteData("ananfu", "session", {
					"expires_in": 7200
				}, console.log)
				//console.log("getOpenId============")
				var obj = {}
				var options =
					encodeURI('https://api.weixin.qq.com/sns/jscode2session?appid=wx56df671c2e5c8bb7&secret=e6aa6023ff0b180b05b9c2270fb7cf81&js_code=' + code + '&grant_type=authorization_code/')
					//console.log("options=" + options)
					const https = require('https');
				https.get(options, (res) => {
					//console.log('状态码：', res.statusCode);
					//console.log('请求头：', res.headers);
					res.on('data', (d) => {
						var e = JSON.parse(d)
							var sessiondata = {
							"session_key": e.session_key,
							"expires_in": 7200,
							"openid": e.openid,
							"intime": Date.now()
						}
						basetime = Date.now()
							console.log("[*] 将本次读取时间写入 basetime:", basetime)
							MongodbHandler.insertData("ananfu", "session", sessiondata, console.log)
							console.log('[*] 将session登陆信息,写入mongoDB', sessiondata)
							myopenid = e.openid
							console.log("[*] 从微信获得myopenid: ", myopenid)
							this.getWeChatPayid(null, null, myopenid, null, null, null, null, null, null, finalResponse)
					});
				}).on('error', (e) => {
					console.error("[*] 获得OPENID 失败");
					console.error(e);
				});
			}
	},
	getXMLNodeValue: function (node_name, xml, flag) {
		flag = flag || false;
		var _reNodeValue = '';
		console.log(node_name)
		console.log(xml)
		console.log(flag)
		var tmp = xml.toString().split('<' + node_name + '>');
		if (tmp) {
			var _tmp = tmp[1].split('</' + node_name + '>')[0];
			if (!flag) {
				var _tmp1 = _tmp.split('[');
				_reNodeValue = _tmp1[2].split(']')[0]
			} else {
				_reNodeValue = _tmp;
			}
		}
		console.log(_reNodeValue.toString("UTF-8"))
		return _reNodeValue.toString("UTF-8");
	},

	// 取得微信支付返回的数据，用于生成二维码或是前端js支付数据
	getWeChatPayid: function (_spbillId, _traType, _openid, _out_trade_no, _attach, _product_id, _body, _cb, _cbfail, finalResponse) {

		//取得需向微信服务器发送的数据,且通过该数据组进行xml与sign数据生成
		//数据集必须包含所有微信端所必须的字段数据信息
        var me = this
		var _preArray = {
			appid: config.appid, //小程序ID
			mch_id: config.mch_id, //微信支付商户号
			//			device_info: "WEB", //收银设备,公众号内填写WEB
			nonce_str: this.getNonceStr(), //生成随机数
			notify_url: config.notify_url, //回调函数
			body: _body || 'ananshopping', // 支付内容
			out_trade_no: _out_trade_no || ('wxpay' + Math.floor((Math.random() * 1000) + 1)), //订单号
			total_fee: 1, //支付金额，单位分
			//			attach: _attach || 'payfunction', //附加信息内容
			spbill_create_ip: _spbillId || '10.9.38.224', //客户端ip
			//			product_id: _product_id || 'wills001', // 商品ID, 若trade_type=NATIVE，此参数必传
			notify_url: "https://70139330.qcloud.la/notify",
			trade_type: _traType || 'JSAPI',
			openid: _openid || 'o44Xt0ESHNe6SSyVL9aP6B_noTdY',
			//			time_start: this.getTimeStamp(),
			//			limit_pay: "no_credit", //不支持支付信用卡支付
		};
		//console.log(_preArray)
		//取得xml请求数据体
		var _formData = this.getXmlFormat(_preArray);
		//向微信服务端请求支付
		//console.log("config.prepay_id_url=" + config.prepay_id_url)
		console.log("[*] 生成POST数据 _formData = " + _formData)
		var unifieorderUrl = "https://api.mch.weixin.qq.com/pay/unifiedorder";
		request({
			url: unifieorderUrl,
			method: 'POST',
			body: _formData
		}, function (err, response, body) {
			console.log('[*] 状态码：', response.statusCode);
			console.log('[*] 请求头：', response.headers);
			if (!err && response.statusCode == 200) {
				console.log("[*] request.body", body);
				//返回来的XML数据
				console.log("\n[*] STATUSCODE=200", body)
				var _reBodyXml = body //.toString();
					//取得return_code进行成功与否判断
					var _reCode = me.getXMLNodeValue('return_code', _reBodyXml, false);
				// //console.log('return code', _reCode);
				var rePrepayId = {
					prepay_id: '',
					code_url: '',
					timestamp: _preArray.time_start,
					nonceStr: _preArray.nonce_str,
					paySign: '',
					msg: '请求prepay_id'
				};
				if (_reCode == 'SUCCESS') {
					console.log("statusCode=200, _reCode=SUCC")
					var _resultCode = me.getXMLNodeValue('result_code', _reBodyXml, false);
					if (_resultCode == 'SUCCESS') {
						console.log("[*] 获得PREPAYID 二维码statusCode=200, _reCode=SUCC, _resultCode=SUCC")
						console.log("statusCode=200, _reCode=SUCC, _resultCode=SUCC")
						//成功时返回prepay_id与二维码
						rePrepayId.prepay_id = me.getXMLNodeValue('prepay_id', _reBodyXml, false);
						rePrepayId.msg = '成功取得prepay_id';
						if (_preArray.trade_type == 'NATIVE') {
							rePrepayId.code_url = me.getXMLNodeValue('code_url', _reBodyXml, false);
						} else if (_preArray.trade_type == 'JSAPI') {
							console.log("JSAPI\n")
							var _signPara = {
								appid: config.appid,
								timeStamp: _preArray.time_start,
								nonceStr: _preArray.nonce_str,
								package: 'prepay_id=' + rePrepayId.prepay_id,
								signType: 'MD5'
							};
							rePrepayId.paySign = me.paySign(_signPara);
							/**
							添加rePreayId并返回
							 */
							WxPayHandler.getOpenId(codedata)
							response.writeHead(200, {
								"Content-Type": "text/plain"
							});
							response.write(rePrepayId, "utf8")
							response.end();
						}
					} else {
						console.log("[*] statusCode=200, _reCode=SUCC, _resultCode=FAIL")
						console.log("[*] 获得统一prepay_id报错")
						rePrepayId.msg = getXMLNodeValue('err_code_des', _reBodyXml, false);
					}
					_cb && _cb(rePrepayId);
				} else if (_reCode == 'FAIL') {
					console.log("[*] statusCode=200, _reCode=FAIL")
					console.log("[*] _reBodyXml = ", _reBodyXml)
					rePrepayId.msg = me.getXMLNodeValue('return_msg', _reBodyXml, false)
						console.log("[*] rePrepayId.msg = ", rePrepayId.msg)
						_cbfail && _cbfail(rePrepayId);
				}
			} else {
				console.log("[*] request.body", body);
			}
		});
	},

	getRawString: function (args) {
		var keys = Object.keys(args);
		keys = keys.sort()
			console.log(keys)
			var newArgs = {};
		keys.forEach(function (key) {
			console.log(key)
			newArgs[key] = args[key];
		});

		var string = '';
		for (var k in newArgs) {
			//如果参数的值为空不参与签名
			if (newArgs[k]) {
				console.log(k)
				string += '&' + k + '=' + newArgs[k];
			}
		}
		string = string.substr(1);
		console.log(string)
		return string;
	},

	//根据数据格式需求生成签名
	paySign: function (_array) {
		_array = _array || {};
		//拼接成微信服务器所需字符格式
		var string = this.getRawString(_array);
		console.log(string)
		//key为在微信商户平台(pay.weixin.qq.com)-->
		/*账户设置-->
		API安全-->
		密钥设置*/
		var key = config.api_key;
		string = string + '&key=' + key;
		var crypto = require('crypto');
		console.log("add key ready to sign:" + string)
		//var utilMd5 = require('../utils/md5.js');
		//var cryString = utilMd5.hexMD5(string);
		var cryString = crypto.createHash('md5').update(string, 'utf8').digest('hex');
		console.log(cryString.toUpperCase)
		//对加密后签名转化为大写
		return cryString.toUpperCase();
	},

	//取得timestamp
	getTimeStamp: function () {
		console.log(parseInt(new Date().getTime() / 1000) + '')
		return parseInt(new Date().getTime() / 1000) + '';
	},

	//取得随机数
	getNonceStr: function () {
		var noncestr = Math.random().toString(36).substr(2, 15);
		console.log(noncestr)
		return noncestr
	},

	//形成向微信服务器请求的xml格式数据
	getXmlFormat: function (_array) {
		var keys = Object.keys(_array);
		keys = keys.sort()
        var _xmlData = '<xml>';
		keys.forEach(function (key) {
          _xmlData += '<' + key + '>' + _array[key] + '</' + key + '>';
		});
		//取得签名加密字符串
		var _paySign = this.paySign(_array);
		_xmlData += '<sign>' + _paySign + '</sign>';
		_xmlData += '</xml>';
		// console.log('xml data ===', _xmlData);
		return _xmlData;
	},
}

module.exports = LuckyRun;
