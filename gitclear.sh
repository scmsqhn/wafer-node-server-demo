 ps -aux|grep pm2|awk '{print"kill -9 " $2}'|sh
 ps -aux|grep node|awk '{print"kill -9 " $2}'|sh
