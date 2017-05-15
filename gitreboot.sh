ps -aux |grep  node |awk '{print "kill -9 " $1}' |sh
netstat -ano |grep 5757|awk '{print "kill -9 " $7}' |sh
pm2 restart process.json
echo pm2 restart process.json
pm2 logs
echo pm2 logs