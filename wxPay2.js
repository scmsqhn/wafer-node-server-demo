'use strict';

const https = require('https');
const config = require('../config');

//2小时过期时间，60*60*2
var expireTime = 7200000;

// 频繁访问限制,保存每次申请内容
var sessionData= {"session_key":"hULnAWfL3CNLoGCw9Nx21g==","expires_in":7200,"openid":"o44Xt0ESHNe6SSyVL9aP6B_noTdY"}


class WxPayHandler {

	constructor(name) {
		this.name = name;
		console.log("new WxPayHandler()")
	}

	TimePassed() {
		console.log("isTimePassed")
        console.log("Date.now="+Date.now())
		console.log("explains_in="+sessionData.expires_in_time)
		console.log("expireTime="+expireTime)
        var length= 0
        for (var i in sessionData){
            length++
        }
        console.log("length="+length)
        if (length>0){
            console.log(Date.now())
            console.log(sessionData.expires_in_time)
            console.log(Date.now()-sessionData.expires_in_time)
		    if((Date.now() - sessionData.expires_in_time) < expireTime){
                console.log(Date.now()-sessionData.expires_in_time)
                console.log("time is not passed")
                return true
            }else{
                console.log("time is passed, reget")
                return false
            }
        }else{
            return false
        }
	}

	getOpenId(config, body) {
		var code = body.code
        console.log(code)
        var orderList = body.orderList //[{period: jine},...]
        console.log(orderList)
        var timer = this.TimePassed()
        console.log("TimePassed="+timer)
        if (timer) {
				console.log("time is not passed, obtain from sessionData\\")
				return sessionData.openid
        }
		console.log("getOpenId============")
		debugger;
		var obj = {}
		var options =
			encodeURI('https://api.weixin.qq.com/sns/jscode2session?appid=wx56df671c2e5c8bb7&secret=e6aa6023ff0b180b05b9c2270fb7cf81&js_code=' + code + '&grant_type=authorization_code/')
			console.log("options="+options)
			const https = require('https');
		https.get(options, (res) => {
			console.log('状态码：', res.statusCode);
			console.log('请求头：', res.headers);
			res.on('data', (d) => {
				process.stdout.write(d)
                sessionData=eval(d)
				sessionData = {
					"expires_in_time": Date.now()
				}
                console.log("sessionData="+sessionData)
                console.log("openId="+sessionData.openid, "session_key="+sessionData.session_key, "expires_in"+sessionData.expires_in,"expires_in_time="+sessionData.session_key)
				return sessionData
			});
		}).on('error', (e) => {
			console.error(e);
		});
	}
    
	// 取得微信支付返回的数据，用于生成二维码或是前端js支付数据
	getWeChatPayid(_spbillId, _traType, _openid, _out_trade_no, _attach, _product_id, _body, _cb, _cbfail) {

		//取得需向微信服务器发送的数据,且通过该数据组进行xml与sign数据生成
		//数据集必须包含所有微信端所必须的字段数据信息
		var _preArray = {
			appid: config.appId, //小程序ID
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
		request({
			url: config.prepay_id_url,
			method: 'POST',
			body: _formData
		}, function (err, response, body) {
			if (!err && response.statusCode == 200) {
                console.log('[*] 向服务器请求支付');
				//返回来的XML数据
				var _reBodyXml = body.toString('uft-8');
				console.log('return xml data ==', _reBodyXml);
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
                    console.log('[*] _reCode == "SUCCESS"');
					var _resultCode = getXMLNodeValue('result_code', _reBodyXml, false);
					if (_resultCode == 'SUCCESS') {
                        console.log('[*] _reCode == "SUCCESS",_resultCode == "SUCCESS"');
						//成功时返回prepay_id与二维码
						rePrepayId.prepay_id = getXMLNodeValue('prepay_id', _reBodyXml, false);
						rePrepayId.msg = '成功取得prepay_id';
						if (_preArray.trade_type == 'NATIVE') {
							rePrepayId.code_url = getXMLNodeValue('code_url', _reBodyXml, false);
						} else if (_preArray.trade_type == 'JSAPI') {
							var _signPara = {
								appId: config.appId,
								timeStamp: _preArray.time_stamp,
								nonceStr: _preArray.nonce_str,
								package: 'prepay_id=' + rePrepayId.prepay_id,
								signType: 'MD5'
							};
							rePrepayId.paySign = paySign(_signPara);
                            return rePrepayId.paySign
						}
					} else {
						rePrepayId.msg = getXMLNodeValue('err_code_des', _reBodyXml, false);
					}
					_cb && _cb(rePrepayId);
				} else if (_reCode == 'FAIL') {
                    console.log("[*] _reCode == 'FAIL'");
					_cbfail && _cbfail(rePrepayId);
				}
			}
		});
		_formData = null;
	}

	//根据数据格式需求生成签名
	paySign(_array) {
        console.log("[*] paySign(_array)", _array);
		_array = _array || {};
		//拼接成微信服务器所需字符格式
		var string = getRawString(_array);
		//key为在微信商户平台(pay.weixin.qq.com)-->账户设置-->API安全-->密钥设置
		var key = wechat.config.api_key;
		string = string + '&key=' + key;
		var crypto = require('crypto');
		var cryString = crypto.createHash('md5').update(string, 'utf8').digest('hex');
		//对加密后签名转化为大写
		return cryString.toUpperCase();
	}

	//取得timestamp
	getTimeStamp() {
		console.log(parseInt(new Date().getTime() / 1000) + '')
		return parseInt(new Date().getTime() / 1000) + '';
	}

	//取得随机数
	getNonceStr() {
		var noncestr= Math.random().toString(36).substr(2, 15);
        console.log(noncestr)
        return getNonceStr()
	}

	//形成向微信服务器请求的xml格式数据
	getXmlFormat(_array) {
		var keys = Object.keys(_array);
		var _xmlData = '<xml>';
		keys.forEach(function (key) {
			_xmlData += '<' + key + '>' + _array[key] + '</' + key + '>';
		});

		//取得签名加密字符串
		var _paySign = paySign(_array);
		_xmlData += '<sign>' + _paySign + '</sign>';
		_xmlData += '</xml>';

		// console.log('xml data ===', _xmlData);
		return _xmlData;
	}

}

module.exports = WxPayHandler;
