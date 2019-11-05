//Made by David Aleixo @ david.aleixo@knowledgebiz.pt
var handler = "ctl-relations";
var log 	= require('../logger');
var db 		= require('../db');
var flow 	= require('../common');


var _getByTemplateId = function(f, tid, cb){
	var flowstr = f + "-" + handler + "-" + "_getByTemplateId:";
	log.debug(flowstr);
	db.relations.getByTemplateId(f,tid,function(e,r){
		if(e){
			log.error(flowstr + "error:" + e);
			cb(e);
		}else{
			log.debug(flowstr + "result: " + r);
			cb(false, r)
		}
	})
}
var _create = function(f, payload, cb){
	var flowstr = f + "-" + handler + "-" + "_create:";
	log.debug(flowstr);
	db.relations.create(f, payload, function(e,r){
		if(e){
			log.error(flowstr + "error:" + e);
			cb(e);
		}else{
			log.debug(flowstr + "result: " + r);
			cb(false, r)
		}
	})
}


var _delete = function(f, rid, cb){
	var flowstr = f + "-" + handler + "-" + "_delete:";
	log.debug(flowstr);
	db.relations.delete(f, rid, function(e,r){
		if(e){
			log.error(flowstr + "error:" + e);
			cb(e);
		}else{
			log.debug(flowstr + "result: " + JSON.stringify(r));
			cb(false, r);
		}
	})
}

module.exports = {
	get : function(req, res, next){
		var f = res.locals.flowid;
		var flowstr = f + "-" + handler + "-" + "get:";

		if(req.params.tid){

			_getByTemplateId(f, req.params.tid, function(e,r){
				if(e){
					log.error(flowstr + "500 - Internal Error" + e);
					res.writeHead(500);
				}else{
					if(r.length > 0 ){
						log.info(flowstr + "200OK:" + JSON.stringify(r));
						res.writeHead(200, {'Content-type': ' application/json'});
						res.write(JSON.stringify(r));
					}else{
						log.info(flowstr + "404 - Resource not found");
						res.writeHead(404);
					}
				}
				res.end();
			})
		}else{
			log.info(flowstr + "400 - Bad request");
			res.write(400);
			res.end();
		}
	},
	create : function(req, res, next){
		var f = res.locals.flowid;
		var flowstr = f + "-" + handler + "-" + "create:";
		_create(f, req.body, function(e,r){
			if(e){
				log.error(flowstr + "500 - Internal Error" + e);
				res.writeHead(500);
			}else{
				log.info(flowstr + "200OK:" + JSON.stringify(r));
				res.writeHead(200, {'Content-type': ' application/json'});
				res.write(JSON.stringify(r.insertId));
			}
			res.end();
		})
	},
	delete : function (req, res, next){
		var f = res.locals.flowid;
		var flowstr = f + "-" + handler + "-" + "delete:";
		if(req.params.rid){
			_delete(f, req.params.rid, function(e,r){
				if(e){
					log.error(flowstr + "500 - Internal Error, " + e);
					res.writeHead(500);
				}else{
					if(r.affectedRows == 0){
						log.info(flowstr + "404 - Resource not found");
						res.writeHead(404);
					}else{
						log.info(flowstr + "200OK: " + JSON.stringify(r));
						res.writeHead(200, {'Content-type': ' application/json'});
						res.write(JSON.stringify({msg: "Deleted", amount: r.affectedRows}));
					}
				}
				res.end();
			})
		}else{
			log.info(flowstr + "400 - Bad request");
			res.writeHead(400, {'Content-type': ' application/json'});
			res.write(JSON.stringify({error:'Check parameter'}));
			res.end();
		}
	}
}