// redis 链接
var redis = require('redis');
var REDIS_PORT= '6379'
var REDIS_IP= '127.0.0.1'
// redis 链接错误
var redisServer = {}
// redis 验证 (reids.conf未开启验证，此项可不需要)
//client.auth("foobared");
RedisServer = {
	set: function (k,v) {
        var client = redis.createClient(REDIS_PORT, REDIS_IP);
        client.on("error", function(err) {
            console.log('[x] error : ', err)
        });
        client.on("connect", function(k, v){
            client.set(k,v,redis.print)
        });
        client.on("ready", function (err) {
            console.log('[x] ready : ', err)
        });
	},
    get: function (k) {
        var client = redis.createClient(REDIS_PORT, REDIS_IP);
        client.on("error", function(err) {
            console.log('[x] error : ', err)
        });
        client.on("connect", function(k, v){
            client.get(k,redis.print)
        });
        client.on("ready", function (err) {
            console.log('[x] ready : ', err)
        });
	}

}
module.exports = RedisServer;