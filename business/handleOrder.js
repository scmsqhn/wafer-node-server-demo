'use strict';


//=== 操作数据库 mongodb
class OrderHandler {
	
	var goodsItem = {
		"buyUnit": "最小投注单位"
		,"desc": "产品描述"
		,"imgUrl": "图片路径"
		,"id": "期数"
		,"period": "期数"
		,"takerate": "投注进度"
		,"takechances": "当前投注金额"
		,"winner": "得主"
		,"datestart": "开售时间"
		,"dateend": "开奖时间"
	}
	
	var orderItem={
		"ordernum": "订单号"
		,"orderTime": "下单时间"
		,"wxID": "下单微信ID"
		,"orderJine": "下单金额"
		,"period": "期数"
	}
	
	checkOrder(instr){
		//console.log(instr)
		
	}
	
	

}

module.exports = OrderHandler;