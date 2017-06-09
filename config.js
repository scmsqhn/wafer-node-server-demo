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
    
    sync: 'https://70139330.qcloud.la/sync'
    
};
