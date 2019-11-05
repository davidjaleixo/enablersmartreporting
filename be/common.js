var log = require('./logger');


module.exports = function(res){
	var f = res.locals.flowid
	var fn = f.split("-");
	var next = parseInt(fn[1])+1;
	var fnnext = fn[0]+"-"+next;
	res.locals.flowid = fnnext;
	return fnnext;
}