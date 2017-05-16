'use strict';

const https = require('https');
const config = require('../config');
const MongodbHandler = require('../business/mongodb_handles');

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
var WxPayHandler
WxPayHandler = {

	constructor: function (name) {
		this.name = name;
		console.log("new WxPayHandler()")
	},

	timecal: function (inputtime) {
		console.log("Date.now()=" + Date.now())
		console.log("inputtime=" + inputtime)
		if ((Date.now() - inputtime) < 7200000) {
			return true
		} else {
			return false
		}
	},
	insertBaseTime() {
		MongodbHandler.insertDocument("admin", "session", Date.now(), null)
	},

	TimePassed: function (data) {
		console.log("TimePassed()" + data)
		var basetime = MongodbHandler.searchMsg("admin", "session", data, null)
			if (basetime == {}) {
				basetime = {
					"intime": Date.now()
				}
			}
			return this.timecal(basetime)
	},

	getOpenId: function (body) {
		var myopenid
		console.log("getOpenId\n")
		console.log("body=" + body)
		var code = body.code
			var intime = body.intimes
			console.log("code=" + code)
			var timer = this.TimePassed({
				"name": 'intime'
			})
			console.log("TimePassed=" + timer)
			if (false) {
				//			if (timer) {
				console.log("time is not passed, obtain from sessionData\\")
				myopenid = timer
			} else {
				console.log("getOpenId============")
				var obj = {}
				var options =
					encodeURI('https://api.weixin.qq.com/sns/jscode2session?appid=wx56df671c2e5c8bb7&secret=e6aa6023ff0b180b05b9c2270fb7cf81&js_code=' + code + '&grant_type=authorization_code/')
					console.log("options=" + options)
					const https = require('https');
				https.get(options, (res) => {
					console.log('状态码：', res.statusCode);
					console.log('请求头：', res.headers);
					res.on('data', (d) => {
                        console.log("d.session_key,d.openid==")
                        console.log(res.body.data.session_key, res.body.data.openid)
                        var sessiondata= {"session_key":res.body.data.session_key,"expires_in":7200,"openid":res.body.data.openid}
						process.stdout.write(d)
						MongodbHandler.insertDocument("admin", "session", sessiondata, console.log)
						myopenid = d.openid
                        console.log("myopenid + d:")
                        console.log(myopenid + d)
               			this.getWeChatPayid(null, null, myopenid, null, null, null, null, null, null)

					});
				}).on('error', (e) => {
					console.error("getopenid error==");
					console.error(e);
				});
			}
	},

	// 取得微信支付返回的数据，用于生成二维码或是前端js支付数据
	getWeChatPayid: function (_spbillId, _traType, _openid, _out_trade_no, _attach, _product_id, _body, _cb, _cbfail) {

		//取得需向微信服务器发送的数据,且通过该数据组进行xml与sign数据生成
		//数据集必须包含所有微信端所必须的字段数据信息
		var _preArray = {
			appid: config.appid, //小程序ID
			mch_id: config.mch_id, //微信支付商户号
			notify_url: config.notify_url, //回调函数
			device_info: "WEB", //收银设备,公众号内填写WEB
			nonce_str: this.getNonceStr(), //生成随机数
			out_trade_no: _out_trade_no || ('pro_wxpay' + Math.floor((Math.random() * 1000) + 1)), //订单号
			attach: _attach || '支付功能', //附加信息内容
			product_id: _product_id || 'wills001', // 商品ID, 若trade_type=NATIVE，此参数必传
			body: _body || '安安福快乐购,支付程序', // 支付内容
			openid: _openid || '',
			spbill_create_ip: _spbillId || '127.0.0.1', //客户端ip
			time_stamp: this.getTimeStamp(),
			trade_type: _traType || 'JSAPI',
			total_fee: 1, //支付金额，单位分
			limit_pay: "no_credit", //不支持支付信用卡支付
		};
		console.log(_preArray)
		//取得xml请求数据体
		var _formData = this.getXmlFormat(_preArray);
		//向微信服务端请求支付
		console.log("config.prepay_id_url=" + config.prepay_id_url)
		console.log("_formData=" + _formData)
		const options = {
			//config.prepay_id_url,
			host: "api.mch.weixin.qq.com",
			path: "/pay/unifiedorder",
			port: 443,
			path: "/",
			method: 'POST',
			body: _formData
		}
		console.log("options to get the msg=" + options)
		const req = https.request(options, (res) => {
				console.log('状态码：', res.statusCode);
				console.log('请求头：', res.headers);
				res.on('data', (d) => {
					console.log("res.on(data)")
					process.stdout.write(d);
					if (res.statusCode == 200) {
						//返回来的XML数据
						var _reBodyXml = body.toString('uft-8');
						console.log("_reBodyXml=" + _reBodyXml)
						//				console.log('return xml data ==', _reBodyXml);
						//取得return_code进行成功与否判断
						var _reCode = getXMLNodeValue('return_code', _reBodyXml, false);
						// console.log('return code', _reCode);

						var rePrepayId = {
							prepay_id: '',
							code_url: '',
							timestamp: _preArray.time_stamp,
							nonceStr: _preArray.nonce_str,
							paySign: '',
							msg: '请求prepay_id'
						};
						if (_reCode == 'SUCCESS') {
							var _resultCode = getXMLNodeValue('result_code', _reBodyXml, false);
							if (_resultCode == 'SUCCESS') {
								//成功时返回prepay_id与二维码
								rePrepayId.prepay_id = getXMLNodeValue('prepay_id', _reBodyXml, false);
								rePrepayId.msg = '成功取得prepay_id';
								if (_preArray.trade_type == 'NATIVE') {
									rePrepayId.code_url = getXMLNodeValue('code_url', _reBodyXml, false);
								} else if (_preArray.trade_type == 'JSAPI') {
									console.log("====")
									console.log("JSAPI")
									var _signPara = {
										appid: config.appid,
										timeStamp: _preArray.time_stamp,
										nonceStr: _preArray.nonce_str,
										package: 'prepay_id=' + rePrepayId.prepay_id,
										signType: 'MD5'
									};
									rePrepayId.paySign = paySign(_signPara);
								}
							} else {
								console.log("====")
								console.log("获得统一prepay_id报错")
								rePrepayId.msg = getXMLNodeValue('err_code_des', _reBodyXml, false);
							}
							_cb && _cb(rePrepayId);
						} else if (_reCode == 'FAIL') {
							console.log("====")
							console.log("获得统一prepay_id报错")
							rePrepayId.msg = getXMLNodeValue('return_msg', _reBodyXml, false);
							_cbfail && _cbfail(rePrepayId);
						}
					}
				});
			});
		req.on('error', (e) => {
			console.log("====")
			console.log("获得统一prepay_id报错")
			console.error(e);
		});
		req.end();
		_formData = null;
	},

	getRawString: function (args) {
		var keys = Object.keys(args);
		keys = keys.sort()
			var newArgs = {};
		keys.forEach(function (key) {
			newArgs[key] = args[key];
		});

		var string = '';
		for (var k in newArgs) {
			//如果参数的值为空不参与签名
			if (newArgs[k]) {
				string += '&' + k + '=' + newArgs[k];
			}
		}
		string = string.substr(1);
		return string;
	},

	//根据数据格式需求生成签名
	paySign: function (_array) {
		_array = _array || {};
		//拼接成微信服务器所需字符格式
		var string = this.getRawString(_array);
		//key为在微信商户平台(pay.weixin.qq.com)-->账户设置-->API安全-->密钥设置
		var key = config.api_key;
		string = string + '&key=' + key;
		var crypto = require('crypto');
		var cryString = crypto.createHash('md5').update(string, 'utf8').digest('hex');
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
	}
}

module.exports = WxPayHandler;
