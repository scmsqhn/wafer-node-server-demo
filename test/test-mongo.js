const http = require('http');
const hostname = '127.0.0.1';
const port = 3000;
const MongodbHandler = require('../business/mongodb_handles') 


var test={}
test={
    resSend: function(res,content){
        res.statusCode =200,
        res.setHeader('Content-Type', 'text/plain');
        res.end(content);
    },
	searchMsg: function (db, coll, whereStr, callback) {
		//连接到表
		MongoClient.connect(DB_URL, function (err, db) {
            console.log("searchMsg")
			if (err) {
                console.log("searchMsg err="+err)
				console.log(err)
			} else {
                console.log("searchMsg else=OK")
				assert.equal(null, err);
				//在test库下blog集合中 新增json文档
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
  test.searchMsg("admin","session", {'expires_in':7200}, test.resSend)
});

server.listen(port, hostname, () => {
  console.log(`服务器运行在 http://${hostname}:${port}/`);
});