var request = require('request');
var crypto = require('crypto');
var qs = require('querystring');
var xml2js = require('xml2js');

var wechat = {};

// 微信基本数据
wechat.config = {
    // 微信公众号 appid
    appId: 'wxbc8b10***********',
    // 微信公众号 appsecret
    appSecret: 'c9934********************',
    // 微信商户号，微信支付要用到的
    mch_id: '***********',
    // 微信支付的api-key
    api_key: '***************',

    // 获取微信基础access-token的url
    accessTokenUrl:'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential',
    // 获取微信网页授权所需的jsapi-ticket的url
    ticketUrl:'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=',

    // 微信支付是否支持信用卡支付
    limit_pay: 'no_credit',
    // 微信支付回调通知支付结果
    notify_url: 'http://www.jmkbio.com/wechat/wxpay-cb',   
    //微信支付统一下单的prepay_id的url
    prepay_id_url: 'https://api.mch.weixin.qq.com/pay/unifiedorder',

    //正式环境的微信端auth2.0网页授权回调URL
    webAuthServerUrl: 'http://www.******.com/wechat/authtoken', 

    //微信网页授权第一步所要请求获得code的URL
    webAuthCodeUrl: 'https://open.weixin.qq.com/connect/oauth2/authorize?',
    //微信网页授权所需的access_token，用于获取到用户的openid等信息
    webAuthTokenUrl: 'https://api.weixin.qq.com/sns/oauth2/access_token?',
};

//用于存储微信的基础access-token值，每天有请求限制次数
var gloAccessTokenData = {};

//公众号微信端页面请求所需jsapi-ticket数据缓存，每天有请求限制，用于签名并返回给前端构造wx.config
var jsapiTicketData = {};

//2小时过期时间，60*60*2
var expireTime = 7200 -100;

// 取得微信web端所需的wxConfig初始化数据
/*********************
    前端所需的数据，timestamp,nonceStr,signature,
    wx.config({
        timestamp: , // 必填，生成签名的时间戳
        nonceStr: '', // 必填，生成签名的随机串
        signature: '',// 必填，签名，见附录1
    });
    _url:微信网页端的请求url值，不包括#后面的数据，
    _cb: 回调函数，接收处理形成的wxconfig数据
***************************/
wechat.getWxConfig = function(_url, _cb) {
    //缓存数据里取得相关的数据， jsapi-ticket等
    if (jsapiTicketData && jsapiTicketData.timestamp) {
        //判断过期时间是否已到
        var t = getTimeStamp() - jsapiTicketData.timestamp;
        //console.log('the gap of the lasttime to get jsapi-ticket : ', t);
        // jsapi-ticket未过期，使用缓存数据进行签名处理
        if (t < expireTime) {
            //console.log('use cache data to get jsapi-ticket!!');
            // 取得网页所需的数据，签名，appid,timestamp, noncestr等
            var _signData = reSignature(_url, jsapiTicketData.ticket);
            _cb && _cb(_signData);
        } else { 
            //console.log('time is out, reget jsapi-ticket!!!');
            //过期时间已到，重新取得网页所需的数据，签名，appid,timestamp, noncestr等
            wechat.getJsapiTicket(function(_tk) {
                var _signData = reSignature(_url, _tk);
                _cb && _cb(_signData);
            });
        }
    } else {
        //console.log('first time to get jsapi-ticket！');
        //该页面首次请求，取得网页所需的数据，签名，appid,timestamp, noncestr等
        wechat.getJsapiTicket(function(_tk) {
                var _signData = reSignature(_url, _tk);
                _cb && _cb(_signData);
            });
    }
};

//取得timestamp
function getTimeStamp() {
    return parseInt(new Date().getTime() / 1000) + '';
};

//取得随机数
function getNonceStr() {
    return Math.random().toString(36).substr(2, 15);
};

//形成key=value&key1=value&...的字符串
function getRawString(args) {
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
};

//形成向微信服务器请求的xml格式数据
function getXmlFormat(_array) {
    var keys = Object.keys(_array);
    var _xmlData = '<xml>';
    keys.forEach(function(key) {
        _xmlData += '<' + key + '>' + _array[key] + '</' + key + '>';
    });

    //取得签名加密字符串
    var    _paySign = paySign(_array);        
    _xmlData += '<sign>' + _paySign + '</sign>';
    _xmlData += '</xml>';

    // //console.log('xml data ===', _xmlData);
    return _xmlData;
};

//取得微信端返回来的xml标签里的value
function getXMLNodeValue(node_name, xml, flag){
    flag = flag || false;
    var _reNodeValue = '';
    var tmp = xml.split('<' + node_name + '>');
    if (tmp) {
        var _tmp = tmp[1].split('</' + node_name + '>')[0];
        if (!flag) {
            var _tmp1 = _tmp.split('[');
            _reNodeValue = _tmp1[2].split(']')[0]
        } else {
            _reNodeValue = _tmp;
        }    
    }
    return _reNodeValue;
};

//响应网页端请求的签名数据
function reSignature(_url, _ticket) {
    var timestamp = getTimeStamp();
    var noncestr = getNonceStr();

    var str = 'jsapi_ticket=' + _ticket + '&noncestr='+ noncestr + '&timestamp=' + timestamp + '&url=' + _url;
    //console.log(str);
    var signature = crypto.createHash('sha1').update(str).digest('hex');

    //console.log('jsapi signature is ', signature);
    var _dataSign = { 
                        appId: wechat.config.appId,
                        timestamp: timestamp,
                        nonceStr: noncestr,
                        signature: signature
                    };

    return _dataSign;
};

//根据数据格式需求生成签名
function paySign(_array) {
    _array = _array || {};
    //拼接成微信服务器所需字符格式
    var string = getRawString(_array);
    //key为在微信商户平台(pay.weixin.qq.com)-->账户设置-->API安全-->密钥设置
    var key = wechat.config.api_key;
    string = string + '&key='+key;  
    var crypto = require('crypto');
    var cryString = crypto.createHash('md5').update(string,'utf8').digest('hex');
    //对加密后签名转化为大写
    return cryString.toUpperCase();
};

// 取得微信的基础access-token，有别于网页auth2.0的access-token
wechat.getGloAcessToken = function(_cb) {
    // 决断是否是首次获取该数据
    if (gloAccessTokenData.token && gloAccessTokenData.timestamp) {
        var t = getTimeStamp() - gloAccessTokenData.timestamp;
        //console.log('the gap of last time to get glo-access-token is : ', t);
        // 数据是否过期判断
        if (t < expireTime) {
            //console.log('get the cache access-token data!');
            _cb && _cb(gloAccessTokenData.token);
        } else {
            //console.log('expiretime is out，reget the access-token data！');
            justGetAccessToken(_cb);          
        }
    } else {
        //console.log('firt time to connect, get the access-token data!!');
        justGetAccessToken(_cb);         
    }
};

// 请求获得token数据, 基础的access-token，与autho2.0网页版不同
function justGetAccessToken(_cb) {
    var _tokenUrl = wechat.config.accessTokenUrl + '&appId=' + wechat.config.appId + '&secret=' + wechat.config.appSecret;
    request.get(_tokenUrl, function(error, response, body) {
        if (error) {
            //console.log('getToken error1111', error);
        }
        else {
            try {
                //console.log('success to get the access-token data ===', JSON.parse(body));
                var _token = JSON.parse(body).access_token;
                // 将取得的access-token保存到内存
                gloAccessTokenData = {
                    token: _token,
                    timestamp: getTimeStamp()
                }
                _cb && _cb(_token);
            }
            catch (e) {
                //console.log('getToken error2222', e);
            }
        }
    });
};

// 取得微信网页端所需的jsapi-ticket
wechat.getJsapiTicket = function(_cb) {
    // 先判断内存（缓存）中是否已有jsapi-ticket数据
    if (jsapiTicketData && jsapiTicketData.timestamp) {
        var t = getTimeStamp() - jsapiTicketData.timestamp;
        //console.log('the gap of last time to get jsapi-ticket is : ', t);
        // 数据是否过期判断
        if (t < expireTime) {
            //console.log('get the cache access-token data!');
            _cb && _cb(jsapiTicketData.ticket);
        } else {
            //console.log('expiretime is out，reget the jsapi-ticket data！');
            justGetJsapiTicket(_cb);          
        }
    } else {
        //console.log('first time to get the jsapi-ticket data！');
        justGetJsapiTicket(_cb); 
    }   
};

// 根据基础access-token(重新)取得jsapi-ticket值
function justGetJsapiTicket(_cb) {
    // 取得jsapi-ticket需有基础的access-token数据
    wechat.getGloAcessToken(function(_tk) {
        var _ticUrl = wechat.config.ticketUrl + _tk + '&type=jsapi';
        request.get(_ticUrl, function(error, res, body) {
            if (error) {
                //console.log('getJsapiTicket error1111', error);
            }
            else {
                try {
                    var _ticket = JSON.parse(body).ticket;
                    //console.log('get new ticket success--', _ticket);                    
                    var timestamp = getTimeStamp();

                    //将token与ticket数据保存在内存中
                    jsapiTicketData = {
                        timestamp: timestamp,
                        token: _tk,
                        ticket: _ticket
                    };

                    _cb && _cb(_ticket);  
                }
                catch (e) {
                    //console.log('getJsapiTicket error2222', e);
                }
            }
        });
    });
};
//取得auth2.0网页授权code请求Url, _cb用于重定向该url并将后续得到的code值去得到用户的openid值 
/*
  _path: 获取code的回调路径，用于形成最终的微信服务器回调地址
         redirect_uri = baseUrl + _path
  _scope: 取得用户授权的类型，snsapi_base是静默授权并自动跳转到回调页的
          snsapi_userinfo授权需要用户手动同意，并且由于用户同意过，用来获取用户的基本信息
*/
wechat.getWebAuthCodeUrl = function(_path, _scope) {
    _path = _path || '';
    var  _codeParams = {
        appid: wechat.config.appId,
        //网页auth2.0授权取得code后的回调地址，需urlencode处理
        redirect_uri: wechat.config.webAuthServerUrl + _path, 
        response_type: 'code',
        scope: _scope || 'snsapi_base', //是静默授权或是手工授权
        state: 'STATA'
    };
    var _webCodeUrl = wechat.config.webAuthCodeUrl +  qs.stringify(_codeParams) + '#wechat_redirect';
    //console.log('web auth get code', _webCodeUrl);

     return _webCodeUrl;
};

//取得网页授权数据, access_token, openid等
wechat.getWebAuthToken = function(_code, _cb, _cbfail) {
    var _tokenParams = {
        appid: wechat.config.appId,
        secret: wechat.config.appSecret,
        code: _code,
        grant_type: 'authorization_code',
      };

    var _webTokenUrl = wechat.config.webAuthTokenUrl + qs.stringify(_tokenParams);
    //console.log('web auth get access_token url: ', _webTokenUrl);

    request({
        method: 'get',
        url: _webTokenUrl
    }, function(err, res, body) {
        if (body) {
            var _data = JSON.parse(body);
            //console.log('the openid of wx-user is ===', _data.openid);
            _cb && _cb(_data);
        } else {
            //console.log('fail to get the web auth-token&&openid, error msg is ', err);
          }
    });
};
// 取得微信支付返回的数据，用于生成二维码或是前端js支付数据
wechat.getWeChatPayid = function(_spbillId, _traType, _openid, _out_trade_no, _attach, _product_id, _body, _cb, _cbfail){
    //console.log('客户端请求ip:', _spbillId);

    //取得需向微信服务器发送的数据,且通过该数据组进行xml与sign数据生成
    //数据集必须包含所有微信端所必须的字段数据信息
    var _preArray = {
        appid: wechat.config.appId,
        mch_id: wechat.config.mch_id, //微信支付商户号
        notify_url: wechat.config.notify_url, //回调函数
        out_trade_no: _out_trade_no || ('pro_wxpay' + Math.floor((Math.random()*1000)+1)), //订单号
        attach: _attach || '支付功能', //附加信息内容
        product_id: _product_id || 'wills001', // 商品ID, 若trade_type=NATIVE，此参数必传
        body: _body || 'H5端支付功能开发', // 支付内容
        openid: _openid || '',
        spbill_create_ip: _spbillId || '127.0.0.1', //客户端ip
        time_stamp: getTimeStamp(), 
        trade_type: _traType || 'JSAPI', 
        total_fee: 1, //支付金额，单位分
        nonce_str: getNonceStr(),
        limit_pay: wechat.config.limit_pay, //是否支付信用卡支付
    };

    //取得xml请求数据体
    var _formData = getXmlFormat(_preArray);

    //向微信服务端请求支付
    request({
        url : wechat.config.prepay_id_url,
        method : 'POST',
        body : _formData
    }, function (err, response, body) {
        if (!err && response.statusCode == 200) {
            //返回来的XML数据
            var _reBodyXml = body.toString('uft-8');
            //console.log('return xml data ==', _reBodyXml);
            //取得return_code进行成功与否判断
            var _reCode = getXMLNodeValue('return_code', _reBodyXml, false);
            // //console.log('return code', _reCode);

            var rePrepayId = {
                prepay_id: '',
                code_url: '',
                timestamp: _preArray.time_stamp,
                nonceStr: _preArray.nonce_str,
                paySign: '',
                msg: '请求prepay_id'
            };
            if (_reCode=='SUCCESS') {
                var _resultCode = getXMLNodeValue('result_code', _reBodyXml, false);
                if (_resultCode=='SUCCESS') {
                    //成功时返回prepay_id与二维码
                   rePrepayId.prepay_id = getXMLNodeValue('prepay_id', _reBodyXml, false);
                   rePrepayId.msg = '成功取得prepay_id';
                   if (_preArray.trade_type == 'NATIVE') {
                       rePrepayId.code_url = getXMLNodeValue('code_url', _reBodyXml, false);
                   } else if(_preArray.trade_type == 'JSAPI') {
                        var _signPara = {
                                appId: wechat.config.appId,
                                timeStamp: _preArray.time_stamp,
                                nonceStr: _preArray.nonce_str,
                                package: 'prepay_id=' + rePrepayId.prepay_id,
                                signType: 'MD5'
                            };
                        rePrepayId.paySign = paySign(_signPara);
                   }                   
                } else {
                    rePrepayId.msg = getXMLNodeValue('err_code_des', _reBodyXml, false);
                }
                _cb && _cb(rePrepayId);
            } else if (_reCode=='FAIL') {
                rePrepayId.msg = getXMLNodeValue('return_msg', _reBodyXml, false);
                _cbfail && _cbfail(rePrepayId);
            }          
        }
    });
    _formData = null;
};

var bodyParser = require('body-parser');
require('body-parser-xml')(bodyParser);
// 解决微信支付通知回调数据
app.use(bodyParser.xml({
  limit: '1MB',   // Reject payload bigger than 1 MB 
  xmlParseOptions: {
    normalize: true,     // Trim whitespace inside text nodes 
    normalizeTags: true, // Transform tags to lowercase 
    explicitArray: false // Only put nodes in array if >1 
  }
}));
// 微信支付回调,回调数据要以实际数据进行解析
/*
express4.X返回的数据
 _returnData = { xml: 
   { appid: 'wxbc8b10******************',
     attach: '支付功能',
     bank_type: 'CFT',
     cash_fee: '1',
     fee_type: 'CNY',
     is_subscribe: 'Y',
     mch_id: '137*******',
     nonce_str: '10fskie7bymn29',
     openid: 'ooqSov0HufIdX7YGY1ePDC5NJS-w',
     out_trade_no: 'pro_wxpay649',
     result_code: 'SUCCESS',
     return_code: 'SUCCESS',
     sign: '549B3D77F7C5E2766406A68BA3E27D78',
     time_end: '20160823162731',
     total_fee: '1',
     trade_type: 'JSAPI',
     transaction_id: '4000732001201608232045230805' 
    }
   }
*/
wechat.wxPayCallback = function(_req, _cb) {
    //返回来的XML数据，现在是以express4.X的返回数据为例子，实际中要以实际数据进行解析
    var _reBody = _req.body || _req.rawBody;
    var _payInfo = _reBody.xml;

    if (_payInfo.return_code == 'SUCCESS') {
        //console.log('用户成功支付金额：', _payInfo.cash_fee);
        //console.log('用户openid：', _payInfo.openid);
    } else {
        //console.log('用户支付失败：', _payInfo.return_msg);
        //console.log('用户openid：', _payInfo.openid);
    }
    var    xml = '<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>';

    _cb && _cb(xml);
};

module.exports = wechat;
//http://www.jianshu.com/p/75b9612692f2