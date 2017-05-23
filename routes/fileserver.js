var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');
var dir = process.argv[2];
var ROOT = dir ? dir : process.cwd();
var fs= require('fs')

var MIME = {
    'htm':  'text/html',
    'html': 'text/html',
    'css':  'text/css',
    'gif':  'image/gif',
    'ico':  'image/x-icon',
    'jpg':  'image/jpeg',
    'js':   'text/javascript',
    'png':  'image/png',
    'rar':  'application/x-rar-compressed',
    'txt':  'text/plain',
    'json': 'text/plain',
    'jar':  'application/java-archive'
};


var writeOut = function (query, res) {
    res.write(JSON.stringify(query));
    res.end();
}

module.exports = (request, response) =>
{
    if (request.method.toUpperCase() == 'GET') {
        
        /**
         * 也可使用var query=qs.parse(url.parse(req.url).query);
         * 区别就是url.parse的arguments[1]为true：
         * ...也能达到‘querystring库’的解析效果，而且不使用querystring
         */
        
        var query = url.parse(request.url, true).query;
        console.log("===fileserver start")
//        console.log("request.code=",request)
        console.log("-------------------")
        var pathname = url.parse(request.url).pathname;
        console.log(pathname)
        var realPath = path.resolve('./assert') + '/' + query.file;
        var type= query.file.split('.')[1]
        console.log("type= ",type)
        console.log("realPath= ", realPath)
        console.log("./= ", path.resolve('./'))
        var obj1=path.parse(realPath);
        fs.exists(realPath, function (exists) {
          if (!exists) {
            console.log(realPath,"is not exist")
            response.writeHead(404, {'Content-Type': 'text/plain'});
            response.write("This request URL " + pathname + " was not found on this server.");
            response.end();
          } else {
            fs.readFile(realPath, "binary", function(err, file) {
                if (err) {
                    response.writeHead(500, {'Content-Type': 'text/plain'});
                    response.end(err);
                } else {
                    response.writeHead(200, {'Content-Type': MIME[type]});  
                    response.write(file, "binary");  
                    response.end();
                }
            });
          }
        });
    }
}