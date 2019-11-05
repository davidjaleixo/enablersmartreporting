var log = require('../logger');

module.exports = function(req, res, next){
	log.info(res.locals.flowid + " - " + req.method + " " + req.originalUrl + " "+JSON.stringify(req.body));
	//log.info(res.locals.flowid + "-" + req.method + " " + req.originalUrl);
	next();
}