//Made by David Aleixo @ david.aleixo@knowledgebiz.pt
var handler = "ctl-templates";
var log 	= require('../logger');
var db 		= require('../db');
var flow 	= require('../common');


//internal handlers
var _getByUserId = function(f, uid, cb){
	var flowstr = f + "-" + handler + "-" + "_getByUserId:";
	log.debug(flowstr);
	db.templates.getByUserId(f,uid,function(e,r){
		if(e){
			log.error(flowstr + "error:" + e);
			cb(e);
		}else{
			log.debug(flowstr + "result: " + r);
			cb(false, r)
		}
	})
}

var _getByTplId = function(f, tid, cb){
	var flowstr = f + "-" + handler + "-" + "_getByTplId:";
	log.debug(flowstr);
	db.templates.getByTplId(f,tid,function(e,r){
		if(e){
			log.error(flowstr + "error:" + e);
			cb(e);
		}else{
			log.debug(flowstr + "result: " + r);
			cb(false, r)
		}
	})
}

var _create_check_payload = function(f, payload){
	var flowstr = f + "-" + handler + "-" + "_create_check_payload:Checking payload structure";
	log.debug(flowstr);
	return (payload.user && payload.tpl_name) ? true : false;
}

var _create = function(f, payload, cb){
	var flowstr = f + "-" + handler + "-" + "_create:";
	log.debug(flowstr);
	db.templates.create(f, payload, function(e,r){
		if(e){
			log.error(flowstr + "error:" + e);
			cb(e);
		}else{
			log.debug(flowstr + "result: " + r);
			cb(false, r)
		}
	})
}

//input structure
/*
{
	tid: "",
	op: [{op: "replace", obj: "", v: "" }]
}
*/
var _update = function(f, payload, cb){
	var flowstr = f + "-" + handler + "-" + "_update:";
	log.debug(flowstr);
	var result = [];

	var i = 0;
	payload.op.forEach( function(eachInstruction){

		switch (eachInstruction.op) {
			case 'replace' :
				_replace(f, payload.tid, eachInstruction.obj, eachInstruction.v, function(e,r){
					if(e){
						log.error(flowstr + "error:" + e);
						result.push({id: i, object: eachInstruction.obj, success: false, msg: e});
					}else{
						log.debug(flowstr + "updated");
						result.push({id: i, object: eachInstruction.obj, success: true, msg: "Value Updated"});
					}
					i++;

					//check if we've finished all the operations
					if(i == payload.op.length){
						log.debug(flowstr + "finished");
						cb(false, result);
					}
				})
				break;
			default:
				log.debug(flowstr + "TODO default statement")
		}
	})
}

var _replace = function(f, tid, obj, v, cb){
	var flowstr = f + "-" + handler + "-" + "_replace:";
	log.debug(flowstr);
	var valid = null;

	//translate keys (user = owner || tpl_name = name)
	if(obj == "user") {
		obj = "owner";
		valid = true;
	}else{
		if(obj == "tpl_name"){
			obj = "name"
			valid = true;
		}else{
			valid = false;
		}
	}

	if (valid){
		
	
		db.templates.update(f, tid, obj, v, function(e,r){
			if(e){ log.error(flowstr + "error:" + e); cb(e)}
				else{ log.debug(flowstr + "result: " + r); cb(false, r)}
		})
	}else{
		cb("Invalid obj");
	}	
}

var _delete = function(f, tid, cb){
	var flowstr = f + "-" + handler + "-" + "_replace:";
	log.debug(flowstr);
	db.templates.delete(f, tid, function(e,r){
		if(e){
			log.error(flowstr + "error:" + e);
			cb(e);
		}else{
			log.debug(flowstr + "result: " + JSON.stringify(r));
			cb(false, r);
		}
	})
}


//module exports
module.exports = {
	getInfo : function(req, res, next){
		var f = res.locals.flowid;
		var flowstr = f + "-" + handler + "-" + "getInfo:";

		if(req.params.tid){
			_getByTplId(f, req.params.tid, function(e,r){
				if(e){
					log.error(flowstr + "500 - Internal Error:" + e);
					res.writeHead(500);
				}else{
					log.info(flowstr + "200OK:" + JSON.stringify(r));
					res.writeHead(200, {'Content-type': ' application/json'});
					res.write(JSON.stringify(r[0]));
				}
				res.end();
			})

		}
	},
	get : function(req, res, next){
		var f = res.locals.flowid;
		var flowstr = f + "-" + handler + "-" + "get:";

		if(req.params.owner){
			//filter by template id
			if(req.query.tid){
				_getByTplId(f, req.query.tid, function(e,r){
					if(e){
						log.error(flowstr + "500 - Internal Error:" + e);
						res.writeHead(500);
					}else{
						if(r.length > 0 ){
							log.info(flowstr + "200OK:" + JSON.stringify(r));
							res.writeHead(200, {'Content-type': ' application/json'});
							res.write(JSON.stringify(r[0]));
						}else{
							log.info(flowstr + "404 - Resource not found");
							res.writeHead(404);
						}
					}
					res.end();
				})
			//get all templates by owner 
			}else{
				_getByUserId(f, req.params.owner, function(e,r){
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
			}
		}else{
			log.info(flowstr + "400 - Bad request");
			res.write(400);
			res.end();
		}
		/*
		if(req.query.tid){
			_getByTplId(f, req.query.tid, function(e,r){
				if(e){
					log.error(flowstr + "500 - Internal Error:" + e);
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
			//get by user id
			if(req.query.uid){
				_getByUserId(f, req.query.uid, function(e,r){
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
		}*/
	},
	create : function(req, res, next){
		var f = res.locals.flowid;
		var flowstr = f + "-" + handler + "-" + "create:";

		if(req.body && _create_check_payload(f, req.body)){
			_create(f, req.body, function(e,r){
				if(e){
					log.error(flowstr + "500 - Internal Error, " + e);
					res.writeHead(500);
				}else{
					log.info(flowstr + "200OK: " + JSON.stringify(r));
					res.writeHead(200, {'Content-type': ' application/json'});
					res.write(JSON.stringify({msg: "Created", id: r.insertId}));
				}
				res.end();
			})
		}else{
			log.info(flowstr + "400 - Bad request");
			res.writeHead(400, {'Content-type': ' application/json'});
			res.write(JSON.stringify({error:'Check payload'}));
			res.end();
		}
	},
	update : function (req, res, next){
		var f = res.locals.flowid;
		var flowstr = f + "-" + handler + "-" + "update:";

		if(req.body){
			_update(f, req.body, function(e,r){
				if(e){
					log.error(flowstr + "500 - Internal Error, " + e);
					res.writeHead(500);
				}else{
					log.info(flowstr + "200OK: " + JSON.stringify(r));
					res.writeHead(200, {'Content-type': ' application/json'});
					res.write(JSON.stringify(r));
				}
				res.end();
			})
		}else{
			log.info(flowstr + "400 - Bad request");
			res.writeHead(400, {'Content-type': ' application/json'});
			res.write(JSON.stringify({error:'Check payload'}));
			res.end();
		}
	},
	delete : function (req, res, next){
		var f = res.locals.flowid;
		var flowstr = f + "-" + handler + "-" + "delete:";
		if(req.params.tid){
			_delete(f, req.params.tid, function(e,r){
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