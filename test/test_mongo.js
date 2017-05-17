const http = require('http');
const hostname = '127.0.0.1';
const port = 3000;

'use strict';

var config = require('../config')
var mongodb = require('mongodb')
var MongoClient = require("mongodb").MongoClient;
var DB_URL = config.mongodb_url
	//var DB_URL = "//0.0.0.0:27017/";
var assert = require('assert');
/**
 * ���ݿ����ݸ�ʽ
 * ���1 ҵ����:
 *  period: 211116272 ����
 *  goods:
 * 	  buyUnit ��СͶע��λ
 * 	  desc ��Ʒ����
 * 	  id ����,��Ʒ��ʾ?
 * 	  imgUrl ͼƬλ�� png ��ʽ
 *  takerate: 0.01, Ͷע����
 *  takechances: 70, ��ǰͶע���
 *  totalchances: 8090,  ��Ͷע���
 *  winner: "��ľ��" ����
 *  datestart:����ʱ��
 *  dateend:����ʱ��
 *
 * ���2 �������:
 *  period: 211116272 ����
 *  order: ������{}
 *    orderNum:������
 *    orderTime:�µ�ʱ��
 *    wxID:�µ�΢��ID
 *    orderJine:�µ����
 *    period:�µ�����,...������������Ϣ
 *
 ***/
var MongodbHandler = {}

//=== �������ݿ� mongodb
MongodbHandler = {
	//---��ʼ�����ݿ�
	initMongoDB: function () {
		console.log("=initMongoDB")
		MongoClient.connect(DB_URL, function (error, db) {
			if (error) {
				console.log(error)
			} else {
				assert.equal(null, err);
				console.log('���ӳɹ�!');
				db.close();
			}
		});
	},
	makeGoodsData: function (period, buyUnit, desc, imgUrl, imgUrl2, imgUrl3, imgUrl4, takerate, takechances, totalchances, winner, datestart, dateend) {
		var data = {
			period: 0,
			goods: {
				buyUnit: 1,
				desc: "",
				imgUrl: "",
				imgUrl2: "",
				imgUrl3: "",
				imgUrl4: ""
			},
			takerate: 0,
			takechances: 0, //�Ѿ���ע����
			totalchances: 0, //�ж��ٸ���ע����,��������buyUnit
			winner: "",
			datestart: "",
			dateend: ""
		}
		return data
	},
	makeOrderData: function (period, orderNum, orderTime, wxID, orderJine) {
		var data = {
			period: period,
			orderNum: orderNum,
			orderTime: orderTime,
			wxID: wxID,
			orderJine: orderJine
		}
		return data
	},
	deleteitem: function (db, coll, callback) {
		MongoClient.connect(DB_URL, function (err, db) {
			if (err) {
				console.log(err)
			} else {
				assert.equal(null, err);
				db.collection(coll).remove({"expires_in": 7200} , function (err, res) {
                    if(err){
                        console.log(err)
                    }else{
                        console.log(res.result.n)
                        console.log(res)
                    }
    				db.close();
				});
			}
		});

	},
	findall: function (db, coll, callback) {
		//���ӵ���
		MongoClient.connect(DB_URL, function (err, db) {
			if (err) {
				console.log(err)
			} else {
				assert.equal(null, err);
				var docs = {}
				db.collection(coll).find(function (err, cursor) {
					cursor.each(function (err, doc) {
						if (doc) {
							docs = {
								i: doc
							}
							console.log(doc)
							callback
							console.log('���������ĵ��ɹ�');
						}
						callback
					})
				});
				db.close();
			}
		});
	},
	searchMsg: function (db, coll, whereStr) {
		//���ӵ���
		MongoClient.connect(DB_URL, function (err, db) {
            console.log("searchMsg")
			if (err) {
                console.log("searchMsg err="+err)
				console.log(err)
			} else {
                console.log("searchMsg else=OK")
				assert.equal(null, err);
				//��test����blog������ ����json�ĵ�
				var i = 0
				var docs = {}
                console.log(whereStr)
				db.collection(coll).find(whereStr, function (err, cursor) {
					cursor.each(function (err, doc) {
                        console.log("cursor.each")
                        if(err){
                            console.log("ERR:"+err)
                            return -1
                        }else{
                            console.log("no err")
            				assert.equal(null, err);
                            console.log("assert right")
                            console.log(doc)
    						if (doc) {
                                console.log("===++++")
                                console.log("search SUCC")
                                console.log(doc.intime)
                                return doc
			    			}
                        }
					})
    				db.close();
				});
			}
		});
	},
	/**
	 * ����session����
	 * var whereStr= {"name": 'node'}
	 **/
	insertDocument: function (db, coll, data, callback) {
		console.log("insertDocument.data" + data)
		MongoClient.connect(DB_URL, function (err, db) {
			if (err) {
				console.log("insertDocument ����: " + err)
				console.log("insertDocument err")
				console.log(err)
			} else {
				assert.equal(null, err);
				console.log("insertDocument �������ݿ�ɹ�")
				//��test����blog������ ����json�ĵ�
				db.collection(coll, {
					safe: true
				}, function (err, coll) {
					console.log("insertDocument ������ݿ�")
					console.log('get collection!');
					console.log(data)
					var ss = JSON.stringify(data);
					console.log("ss:" + ss)
					coll.insertOne({
						session_key: data.session_key,
						expires_in: 7200,
						openid: data.openid
					}, function (err, result) {
						console.log("insertDocument ���ݿ����result:" + result)
						console.log("insertDocument ���ݿ����data:" + data)
						console.log("insertDocument ���ݿ����ss:" + ss)
						assert.equal(err, null);
						console.log('�����ĵ��ɹ�');
						callback(ss + "insert OK");
						db.close();
					});
				});
			}
		});
	},

	/**
	 * ���뽱Ʒ����,����Ϊ����
	 **/
	insertGoodsData: function (db, data) {
		var coll = db.collection("goods");
		coll.insert(data, function (error, result) {
			if (error) {
				console.log('Error:' + error);
			} else {
				console.log(result.result.n);
			}
			db.close();
		});
	},

	/**
	 * ���붩������
	 **/
	insertOrderData: function (db, data) {
		var coll = db.collection("order");
		coll.insert(data, function (error, result) {
			if (error) {
				console.log('Error:' + error);
			} else {
				console.log(result.result.n);
			}
			db.close();
		});
	},

	/**
	 * ����mongoDB����
	 * 		var whereStr = {
	 *		"name": 'node'
	 *	};
	 **/
	searchGoodsMsg: function (db, whereStr, callback) {
		//���ӵ���
		var collection = db.collection('goods');
		//��ѯ����
		collection.find(whereStr, function (error, cursor) {
			cursor.each(function (error, doc) {
				if (doc) {
					//do sth here with callback
					callback(doc)
					//console.log(doc);
					/**
					 * if (doc.addTime) {
					 *    console.log("addTime: " + doc.addTime);
					 **/
				}
			});
		});
	},

	/**
	 * ����mongoDB����
	 * 		var whereStr = {
	 *		"name": 'node'
	 *	};
	 **/
	searchOrderMsg: function (db, whereStr, callback) {
		//���ӵ���
		var collection = db.collection('order');
		//��ѯ����
		collection.find(whereStr, function (error, cursor) {
			cursor.each(function (error, doc) {
				if (doc) {
					//do sth here with callback
					callback(doc)
					//console.log(doc);
					/**
					 * if (doc.addTime) {
					 *    console.log("addTime: " + doc.addTime);
					 **/
				}
			});
		});
	},

	//---����
	updateData: function (db) {
		var devices = db.collection('vip');
		var whereData = {
			"name": "node"
		}
		var updateDat = {
			$set: {
				"age": 26
			}
		}; //�������$set���滻��������
		devices.update(whereData, updateDat, function (error, result) {
			if (error) {
				console.log('Error:' + error);
			} else {
				console.log(result);
			}
			db.close();
		});
	},

	//---ɾ��
	deleteData: function (db) {
		var devices = db.collection('vip');
		var data = {
			"name": "node"
		};
		devices.remove(data, function (error, result) {
			if (error) {
				console.log('Error:' + error);
			} else {
				console.log(result.result.n);
			}
			db.close();
		})
	},

	/**
	 * ʵ�� onRequest ����
	 * �ڿͻ������� WebSocket �ŵ�����֮��
	 * ����� onRequest ��������ʱ���԰��ŵ� ID ���û���Ϣ��������
	 */
	onRequest: function (tunnelId, userInfo) {
		debug(`${this.constructor.name} [onRequest] =>`, {
			tunnelId,
			userInfo
		});

		if (typeof userInfo === 'object') {
			// ���� �ŵ�ID => �û���Ϣ ��ӳ��
			userMap[tunnelId] = userInfo;
		}
	},

	/**
	 * ʵ�� onConnect ����
	 * �ڿͻ��˳ɹ����� WebSocket �ŵ�����֮�����ø÷�����
	 * ��ʱ֪ͨ�����������ߵ��û���ǰ�������Լ��ռ�����û���˭
	 */
	onConnect: function (tunnelId) {
		debug(`${this.constructor.name} [onConnect] =>
`, {
			tunnelId
		});

		if (tunnelId in userMap) {
			connectedTunnelIds.push(tunnelId);

			$broadcast('people', {
				'total': connectedTunnelIds.length,
				'enter': userMap[tunnelId],
			});
		} else {
			debug(`Unknown tunnelId(${tunnelId}) was connectd, close it`);
			$close(tunnelId);
		}
	},

	/**
	 * ʵ�� onMessage ����
	 * �ͻ���������Ϣ�� WebSocket �ŵ��������Ϻ󣬻���ø÷�������ʱ���Դ����ŵ�����Ϣ��
	 * �ڱ�ʾ�������Ǵ��� `speak` ���͵���Ϣ������Ϣ��ʾ���û����ԡ�
	 * ���ǰ�������Ե���Ϣ�㲥���������ߵ� WebSocket �ŵ���
	 */
	onMessage: function (tunnelId, type, content) {
		debug(`${this.constructor.name} [onMessage] =>
`, {
			tunnelId,
			type,
			content
		});

		switch (type) {
		case 'speak':
			if (tunnelId in userMap) {
				$broadcast('speak', {
					'who': userMap[tunnelId],
					'word': content.word,
				});
			} else {
				$close(tunnelId);
			}
			break;

		default:
			// ...
			break;
		}
	}
}

var test={}
test={
    resSend: function(res,content){
        res.statusCode =200,
        res.setHeader('Content-Type', 'text/plain');
        res.end(content);
    },
	searchMsg: function (db, coll, whereStr, callback) {
		//���ӵ���
		MongoClient.connect(DB_URL, function (err, db) {
            console.log("searchMsg")
			if (err) {
                console.log("searchMsg err="+err)
				console.log(err)
			} else {
                console.log("searchMsg else=OK")
				assert.equal(null, err);
				//��test����blog������ ����json�ĵ�
				var i = 0
				var docs = {}
                console.log(whereStr)
				db.collection(coll).find(whereStr, function (err, cursor) {
					cursor.each(function (err, doc) {
                        console.log("cursor.each")
                        if(err){
                            console.log("ERR:"+err)
                            return -1
                        }else{
                            console.log("no err")
            				assert.equal(null, err);
                            console.log("assert right")
                            console.log(doc)
    						if (doc) {
                                console.log("===++++")
                                console.log("search SUCC")
                                console.log(doc.intime)
                                callback
			    			}
                        }
					})
    				db.close();
				});
			}
		});
	},
}

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
//  test.searchMsg("admin","session", {'expires_in':7200})
});

server.listen(port, hostname, () => {
  console.log(`������������ http://${hostname}:${port}/`);
});