//Made by David Aleixo @ david.aleixo@knowledgebiz.pt
var handler = "ctl-owners";
var log 	= require('../logger');
var db 		= require('../db');
var flow 	= require('../common');

module.exports = {
	get : function(req, res, next){
		var f = res.locals.flowid;
		var flowstr = f + "-" + handler + "-" + "get:";
		db.templates.getOwners(f, function(e,r){
			res.writeHead(200, {'Content-type': ' application/json'});
			res.write(JSON.stringify(r));
			res.end();
		})
	}
}