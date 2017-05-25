# README-TWICE.MD
## PATH
H:\wafer-node-server-demo-master\wafer-node-server-demo-master
---

17-05-07
无法访问小程序腾讯云端
已经申请工单，等候回复
工单内容如下：
---
### client 端登陆操作报错
登录失败 LoginError {type: "ERR_LOGIN_FAILED", message: "登录失败，可能是网络错误或者服务器发生异常"}message: "登录失败，可能是网络错误或者服务器发生异常"stack: (...)type: "ERR_LOGIN_FAILED"__proto__: Error
    at http://1932019330.appservice.open.weixin.qq.com/vendor/qcloud-weapp-client-sdk/lib/login.js:18:28
    at http://1932019330.appservice.open.weixin.qq.com/vendor/qcloud-weapp-client-sdk/lib/login.js:22:2
    at require (http://1932019330.appservice.open.weixin.qq.com/WAService.js:7:17824)
    at http://1932019330.appservice.open.weixin.qq.com/WAService.js:7:17573
    at http://1932019330.appservice.open.weixin.qq.com/vendor/qcloud-weapp-client-sdk/index.js:4:13
    at require (http://1932019330.appservice.open.weixin.qq.com/WAService.js:7:17824)
    at http://1932019330.appservice.open.weixin.qq.com/WAService.js:7:17573
    at http://1932019330.appservice.open.weixin.qq.com/app.js:7:14
    at require (http://1932019330.appservice.open.weixin.qq.com/WAService.js:7:17824)
    at http://1932019330.appservice.open.weixin.qq.com/app.js:19:4
---
### server端
无法访问此网站

70139330.qcloud.la 拒绝了我们的连接请求。
请在 Google 中搜索“70139330 qcloud 5757”
---
### ip访问ok
118.19.184.71::5757

	
100000613970 : 2017-05-07 11:46:11
---
### 背景介绍
1 我使用一站式配置，可以运行；
2 会话 业务服务器重装系统，镜像配置 NODESDK镜像  会话 镜像 ，无法工作；
3 持续到现在仍然无法工作；

腾讯云微信小程序服务端 Demo - Node.js

会话管理服务

登录服务
检查登录
信道服务

获得信道地址
---
打扰了
不知道如何修改问题

---
### 运行app.js
找到并重启当前项目的指令语句
> 执行该语句
ps -aux |grep app|awk -e '{print "kill -9 " $2}' |sh
> 打印该语句
ps -aux |grep app|awk -e '{print "kill -9 " $2}' 
> 运行
node app.js
pm2 restart process.js
---
# DNS 问题仍然没有解决,等待腾讯回复
## Node.js
在现有代码框架基础上,进行修改

## 
---
# 8:07 2017/5/14
code
011oDchi2rbAgF0WQ8fi2loUgi2oDchz

状态码： 200
请求头： { connection: 'close',
  'content-type': 'text/plain',
  date: 'Sun, 14 May 2017 00:10:32 GMT',
  'content-length': '100' }
{"session_key":"qKk1tnnUTvPsZilP19ztkg==","expires_in":7200,"openid":"o44Xt0ESHNe6SSyVL9aP6B_noTdY"}[ReferenceError: obj is not defined]
---
# 15:03 2017/5/15
如何让配置文件看起来更及简洁
cat vsftpd.conf |grep -v "^#"|grep -v "^;" |grep -v "^$" 
自己配置
write_enable=YES
local_umask=022
xferlog_std_format=YES
listen_ipv6=YES
userlist_enable=YES
tcp_wrappers=YES
---
网上配置区别
local_root=/home
secure_chroot_dir=/var/run/vsftpd
rsa_cert_file=/etc/ssl/certs/vsftpd.pem

---
远程ftp配置问题
-> TYPE I  
Connecting
-> Quit  
220 (vsFTPd 3.0.2)
-> USER root  
331 Permission denied.
-> PASS *HIDDEN*
503 Login with USER first.
Unable to connect
Disconnected
---
# 14:54 2017/5/16
Error: connect ECONNREFUSED 127.0.0.1:27017
报错
Error: More than 1 database name in URL

这两个错误都和mongod 有关系
---
# 404报错，参数比对
	<appid>wx56df671c2e5c8bb7</appid>
	<mch_id>1436856702</mch_id>
	<device_info>WEB</device_info>
	<nonce_str>fmg9tlu6d6de7b9</nonce_str>
	<notify_url>https://70139330.qcloud.la/notify</notify_url>
    <body>安安福快乐购,支付程序</body>
	<out_trade_no>pro_wxpay882</out_trade_no>
	<total_fee>1</total_fee>
    <attach>支付功能</attach>
	<spbill_create_ip>127.0.0.1</spbill_create_ip>
	<trade_type>JSAPI</trade_type>
	<openid></openid>
	<time_start>1494952585</time_start>
	<limit_pay>no_credit</limit_pay>
    <sign>A1BB57E87F45A28C6440259053A6C89D</sign>
---
   <appid>wx2421b1c4370ec43b</appid>
   <attach>支付测试</attach>
   <body>JSAPI支付测试</body>
   <mch_id>10000100</mch_id>
   <detail><![CDATA[{ "goods_detail":[ { "goods_id":"iphone6s_16G", "wxpay_goods_id":"1001", "goods_name":"iPhone6s 16G", "quantity":1, "price":528800, "goods_category":"123456", "body":"苹果手机" }, { "goods_id":"iphone6s_32G", "wxpay_goods_id":"1002", "goods_name":"iPhone6s 32G", "quantity":1, "price":608800, "goods_category":"123789", "body":"苹果手机" } ] }]]></detail>
   <nonce_str>1add1a30ac87aa2db72f57a2375d8fec</nonce_str>   <notify_url>http://wxpay.wxutil.com/pub_v2/pay/notify.v2.php</notify_url>
   <openid>oUpF8uMuAJO_M2pxb1Q9zNjWeS6o</openid>
   <out_trade_no>1415659990</out_trade_no>
   <spbill_create_ip>14.23.150.211</spbill_create_ip>
   <total_fee>1</total_fee>
   <trade_type>JSAPI</trade_type>
   <sign>0CB01533B8C1EF103065174F50BCA001</sign>

---
# 17-05-17
<xml>
  <appid>wx56df671c2e5c8bb7</appid>
  <mch_id>1436856702</mch_id>
  <nonce_str>1mkig80igxecdi</nonce_str>
  <notify_url>https://70139330.qcloud.la/notify</notify_url>
  <body>ananshopping</body>
  <out_trade_no>pro_wxpay761</out_trade_no>
  <total_fee>1</total_fee>
  <spbill_create_ip>10.9.38.224</spbill_create_ip>
  <trade_type>JSAPI</trade_type>
  <openid>o44Xt0ESHNe6SSyVL9aP6B_noTdY</openid>
  <sign>A295AD893147D83B6C3E0F425CC4713D</sign>
</xml>
---
# node-json
字符串分割

---
# 10:45 2017/5/17
支付基本调通
需要正确的店名和api_key,暂时无法取得;
---
## 调试界面 和 数据库
Unable to fetch Collection stats
调用的目标发生了异常。
Type: System.Reflection.TargetInvocationException
Stack:    在 System.RuntimeMethodHandle._InvokeConstructor(Object[] args, SignatureStruct& signature, IntPtr declaringType)
   在 System.Reflection.RuntimeConstructorInfo.Invoke(BindingFlags invokeAttr, Binder binder, Object[] parameters, CultureInfo culture)
   在 System.Security.Cryptography.CryptoConfig.CreateFromName(String name, Object[] args)
   在 System.Security.Cryptography.MD5.Create()
   在 MongoDB.Driver.MongoUtils.Hash(String text)
   在 MongoDB.Driver.Internal.MongoConnection.Authenticate(MongoServer server, String databaseName, MongoCredentials credentials)
   在 MongoDB.Driver.Internal.MongoConnection.CheckAuthentication(MongoServer server, MongoDatabase database)
   在 MongoDB.Driver.MongoServer.AcquireConnection(MongoDatabase database, Boolean slaveOk)
   在 MongoDB.Driver.Internal.MongoCursorEnumerator`1.GetFirst()
   在 MongoDB.Driver.Internal.MongoCursorEnumerator`1.MoveNext()
   在 MongoDB.Driver.MongoDatabase.GetCollectionNames()
   在 MangoUI.MCollections.GetAll(String db)
   在 MangoUI.MCollections.GetIV(String db)
   在 MangoUI.ComDBOverview.RenderMe()


此实现不是 Windows 平台 FIPS 验证的加密算法的一部分。
Type: System.InvalidOperationException
Stack:    在 System.Security.Cryptography.MD5CryptoServiceProvider..ctor()
---
## 13:47 2017/5/19
插入mongoimport 导入数据
成功
mongoimport -h localhost --port 27017 -d ananfu -c buyhistory -f BUYUNITS,DESC,IMGURL,IMGURL2,IMGURL3,IMGURL4,NAME,TAG,PERIOD,TAKERATE,TAKECHANCES,TOTALCHANCES,WINNER --ignoreBlanks --file /data/release/node-weapp-demo/buyhistory.csv --type csv --headerline --upsert

工作不能拖沓,也不能求快,找好节奏,提高效率;
---
用nodejs搭建一个文件服务器

mongoimport -h localhost --port 27017 -d ananfu -c goodsList --file  /data/release/node-weapp-demo/goodsList.csv --type csv --headerline

尽可能少的减少数据交互





