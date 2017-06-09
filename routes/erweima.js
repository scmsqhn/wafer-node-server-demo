'use strict';

const WxPayHandler = require('../business/wxPay2');
const config = require('../config');
const url = require('url')
const querystring = require('querystring')
const fs = require('fs')

module.exports = (req, res) =>
{
    fs.readFile("wpm1qNwxqE.txt",'binary',function(err,file){
      console.log("erweima file=", file)
      console.log("erweima err=", err)
      res.writeHead(200,{
        "Content-Type":"text/plain",
        "Content-Length":Buffer.byteLength(file,'binary'),
      });
      res.write(file,"binary");
      res.send();
    });
};