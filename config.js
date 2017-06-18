'use strict';

module.exports = {
	/**
	 * Node 服务器启动端口，如果是自行搭建，请保证负载均衡上的代理地址指向这个端口
	 */
	port: '5757',
    
    host: '70139330.qcloud.la',
    
    appid: 'wxa6d9e2698142dcab', //duobao appId
    
    //appid: 'wx56df671c2e5c8bb7', //kuailegou appId
    //secret: 'e6aa6023ff0b180b05b9c2270fb7cf81', //appSecret kuailegou
	
    secret: 'd75c90ba2602cf610cf2b39f4a39c4fe', //duobao
    
    mch_id: '1436856702', //商户号
  	
    api_key: '123456789012345',
    
    prepay_id_url: 'api.mch.weixin.qq.com/pay/unifiedorder',
    
    mongodb_db: "ananfu",
    
    mongodb_url: "mongodb://localhost:27017/ananfu",
    
    notify_url: 'https://70139330.qcloud.la/notify',
    
    sync: 'https://70139330.qcloud.la/sync',

	// 获取微信基础access-token的url
	accessTokenUrl: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential',

	// 获取微信网页授权所需的jsapi-ticket的url
	ticketUrl: 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=',

	// 微信支付是否支持信用卡支付
	limit_pay: 'no_credit',

	// 微信支付回调通知支付结果
	notify_url: 'http://www.jmkbio.com/wechat/wxpay-cb',

	//微信支付统一下单的prepay_id的url
	prepay_id_url: 'https://api.mch.weixin.qq.com/pay/unifiedorder',

	//正式环境的微信端auth2.0网页授权回调URL
	webAuthServerUrl: 'https://${host}/wechat/authtoken',

	//微信网页授权第一步所要请求获得code的URL
	webAuthCodeUrl: 'https://open.weixin.qq.com/connect/oauth2/authorize?',
	
    //微信网页授权所需的access_token，用于获取到用户的openid等信息
	webAuthTokenUrl: 'https://api.weixin.qq.com/sns/oauth2/access_token?',
    
    orderCheckFormMsgID: '9bVbg2NuoTY55Z-trHSMjkfH-NXz0U8XsE9JdE_QdT4'
};
