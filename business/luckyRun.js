'use strict';

const https = require('https');
const request = require("request");
//2小时过期时间，60*60*2
var expireTime = 7200000;
const url = require('url')
	const querystring = require('querystring')
	var http = require('http');
var mongo = require('../business/mongodb_handles');

var config = require('../config')
	var mongodb = require('mongodb')
	var MongoClient = require("mongodb").MongoClient;
var DB_URL = config.mongodb_url
	//var DB_URL = "//0.0.0.0:27017/";
	var assert = require('assert');
var server = new mongodb.Server('127.0.0.1', 27017, {
		auto_reconnect: true
	});
var db = new mongodb.Db('mydb', server, {
		safe: true
	});

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
	getTheLuckyNum: function (max) {
		var Range = max;
		var Rand = Math.random();
		return (Math.round(Rand * Range));
	},
	/**
	@fun:下单成功后,确认是否开奖,如不开奖,则更新数据库,存货信息
	 */
	checkLuckyStatus: function () {
		var that = this
			console.log("[*] 遍历BUYLIST,确认是否有订单需要开奖")
			MongoClient.connect(DB_URL, function (err, db) {
				if (err) {
					console.log(err)
				} else {
					var collection = db.collection("goodsList");
					collection.find({
						//"WINNER": "null"
					}).toArray(function (err, result) {
						if (err) {
							console.log('Error:' + err);
							return
						} else {
							var collection2 = db.collection("buyhistory");
							for (var i = 0; i < result.length; i++) {
								var period = result[i]["PERIOD"];
								var totalchances = result[i]["TOTALCHANCES"];
								console.log("[*] 位置,期数,总金额: ", i, period, totalchances)
								collection2.find({
									'PERIOD': result[i]["PERIOD"]
								}, {
									'PERIOD': 1,
									'BUYUNITS': 1,
									'OPENID': 1,
									'TOTALCHANCES': 1,
								}).toArray(function (err, result) {
									if (err) {
										console.log('Error:' + err);
										return
									} else {
										if (result.length == 0) {
											console.log("[*] 当期无人下注")
										} else {
											//console.log("[*] 获得第 %d 期,下注情况", result[0]["PERIOD"])
											var addsum = 0;

											//var period = result[0]["PERIOD"]
											for (var i = 0; i < result.length; i++) {
												var buyunits = result[i]["BUYUNITS"];
												addsum += buyunits;
											}
											console.log("[*] 第%d期, 投注总金额%d, 当期总金额: ", result[0]["PERIOD"], addsum, totalchances)
											if (totalchances > addsum) {
												console.log('[*] 还未到开奖条件')
												MongoClient.connect(DB_URL, function (err, db) {
													if (err) {
														console.log(err)
													} else {
														var collection = db.collection("goodsList");
														console.log("[*] 更新数据库,第%d期,已经下注%d,比例%f. ", result[0]["PERIOD"], addsum, addsum / totalchances)
														collection.update({
															"PERIOD": parseInt(result[0]["PERIOD"])
														}, {
															$set: {
																"TAKECHANCES": addsum,
																"TAKERATE": addsum / totalchances
															}
														}, {
															safe: true
														}, function (err, result) {
															if (err != null) {
																console.log(err)
															} else {
																console.log("[*] 将获奖结果写入goodsList, 返回: ", result)
															}
														});
														db.close()
													}
												});
											} else if (totalchances <= addsum) {
												console.log('[*] 达到开奖条件,开始开奖')
												var luckynum = -1;
												var openid = "placehold"
													var winner = {}
												console.log('[*] 通过多次抽取随机数,获得最大值,为得主')
												for (var i = 0; i < result.length; i++) {
													var buyunits = parseInt(result[i]["BUYUNITS"]);
													for (var j = 0; j < buyunits; j++) {
														var temp = that.getTheLuckyNum(totalchances);
														//console.log("[*] 由%s,下注第%d笔订单,第%d次抽取随机数==>%d: ", result[i]["OPENID"], i, j, temp)
														if (temp > luckynum) {
															//console.log(result[i])
															openid = result[i]["OPENID"]
																luckynum = temp
																//console.log('[*] 迭代: ', result[0]["PERIOD"], openid, luckynum)
														}
													}
												}
												console.log("[*] 运算结束,第%d期,得主是%s,最大数为%d,总金额为%d . ", result[0]["PERIOD"], openid, luckynum, totalchances)
												MongoClient.connect(DB_URL, function (err, db) {
													if (err) {
														console.log(err)
													} else {
														var collection = db.collection("goodsList");
														console.log("[*] 更新数据库,第%d期,得主是%s. ", result[0]["PERIOD"], openid)
														collection.update({
															"PERIOD": parseInt(result[0]["PERIOD"])
														}, {
															$set: {
																"WINNER": openid
															}
														}, {
															safe: true
														}, function (err, result) {
															if (err != null) {
																console.log(err)
															} else {
																console.log("[*] 将获奖结果写入goodsList, 返回: ", result["result"])
															}
														});
														db.close()
													}
												});
											} else {
												console.log("[*] 异常,addsum= ", addsum)
											}
										}
									}
								});
							}
						}
						db.close();
					});
				}
			});
	},
	insertOrder: function (obj) {
		MongoClient.connect(DB_URL, function (err, db) {
			if (err) {
				console.log(err)
			} else {
				var collection = db.collection("buyhistory");
				console.log("[*] 有新的订单")
				collection.update({
					"PERIOD": parseInt(result[0]["PERIOD"])
				}, {
					$set: {
						"TAKECHANCES": addsum,
						"TAKERATE": addsum / totalchances
					}
				}, {
					safe: true
				}, function (err, result) {
					if (err != null) {
						console.log(err)
					} else {
						console.log("[*] 将获奖结果写入goodsList, 返回: ", result)
					}
				});
				db.close()
			}
		});
	},
}

module.exports = LuckyRun;