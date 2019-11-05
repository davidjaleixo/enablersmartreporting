var random = require('randomstring');
var generate = function(){
	var r = random.generate()
	return r;
}
module.exports = function(req, res, next){
	res.locals.flowid = generate();
	next();
}