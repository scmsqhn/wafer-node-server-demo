 ps -aux|grep mongo|awk '{print"kill -9 " $2}'|sh
 ps -aux|grep mongod|awk '{print"kill -9 " $2}'|sh
 ps -aux|grep mongodb|awk '{print"kill -9 " $2}'|sh
