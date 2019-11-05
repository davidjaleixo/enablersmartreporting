//Made by David Aleixo @ david.aleixo@knowledgebiz.pt
var handler = "ctl-conn";
var log 	= require('../logger');
var db 		= require('../db');
var flow 	= require('../common');
var mysql	= require('mysql');


var _getById = function(f, cid, cb){
	var flowstr = f + "-" + handler + "-" + "_getById:";
	log.debug(flowstr);
	db.conn.getById(f, cid, function(e,r){
		if(e){
			log.debug(flowstr + "error:" + e)
			cb(e);
		}else{
			log.info(flowstr + "result:" + r);
			cb(false,r);
		}
	})
}
var _getByTplId = function(f, tid, cb){
	var flowstr = f + "-" + handler + "-" + "_getByTplId:";
	log.debug(flowstr);
	db.conn.getByTplId(f, tid, function(e,r){
		if(e){
			log.debug(flowstr + "error:" + e);
			cb(e)
		}else{
			log.info(flowstr + "result:" + e);
			cb(false, r);
		}
	})
}
var _create_chek_payload = function(f, payload){
	var flowstr = f + "-" + handler + "-" + "_create_check_payload:checking payload structure";
	log.debug(flowstr + "starting");
	if(payload.hostname.includes("storage:")){
		return (payload.hostname && payload.port && payload.username && payload.password && payload.dbname && payload.tpl_id) ? true : false
	}else{
		return (payload.hostname && payload.port && payload.username && payload.password && payload.tpl_id && payload.dbname) ? true : false
	}
}

var _create = function(f, payload, cb){
	var flowstr = f + "-" + handler + "-" + "_create:";
	log.debug(flowstr);
	db.conn.create(f, payload, function(e,r){
		if(e){
			log.error(flowstr + "error:" + e);
			cb(e)
		}else{
			log.info(flowstr + "result:" + e);
			cb(false, r);
		}
	})
}

var _update = function(f, cid, payload, cb){
	var flowstr = f + "-" + handler + "-" + "_update:";
	log.debug(flowstr);
	var result = [];

	var i = 0;
	payload.forEach( function (eachInstruction){
		switch (eachInstruction.op) {
			case 'replace' :
			db.conn.update(f, cid, eachInstruction.obj, eachInstruction.v, function(e,r){
				if(e){
					log.error(flowstr + "error:" + e);
					result.push({id: i, object: eachInstruction.obj, success: false, msg: e});
				}else{
					log.debug(flowstr + "result: " + r);
					result.push({id: i, object: eachInstruction.obj, success: true, msg: "Value Updated"});
				}
				i++;
					//check if we've finished all the operations
					if(i == payload.length){
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

var _getSelectedTables = function(f, tid, cb){
	var flowstr = f + "-" + handler + "-" + "_getSelectedTables:";
	log.debug(flowstr);
	db.tables.getByTplId(f,tid,function(e,r){
		if(e){
			log.error(flowstr + "error:" + e);
			cb(e);
		}else{
			log.debug(flowstr + "result: " + r);
			cb(false, r)
		}
	})
}

var _delete = function(f, cid, cb){
	var flowstr = f + "-" + handler + "-" + "_delete:";
	log.debug(flowstr);
	db.conn.delete(f, cid, function(e,r){
		if(e){
			log.error(flowstr + "error:" + e);
			cb(e);
		}else{
			log.debug(flowstr + "result:" + JSON.stringify(r));
			cb(false, r);
		}
	})
}

module.exports = {
	get : function(req, res, next){
		var f = res.locals.flowid;
		var flowstr = f + "-" + handler + "-" + "get:";

		if(req.params.tid){
			_getByTplId(f, req.params.tid, function(e,r){
				if(e){
					log.error(flowstr + "500 - Internal Error" + e);
					res.writeHead(500);
				}else{
					if(r.length >0){
						log.info(flowstr + "200OK:" + JSON.stringify(r));
						res.writeHead(200,{'Content-type': ' application/json'});
						res.write(JSON.stringify(r[0]));
					}else{
						log.info(flowstr + "404 - Resource not found");
						res.writeHead(404);
					}
				}
				res.end();
			})

		}else{
			
			log.info(flowstr + "400 - Bad request");
			res.writeHead(400);
			res.end();
		}
	},
	create : function(req, res, next){
		var f = res.locals.flowid;
		var flowstr = f + "-" + handler + "-" + "create:";
		log.info(flowstr + "starting");
		if(req.body && _create_chek_payload(f, req.body)){
			_create(f, req.body, function(e,r){
				if(e){
					log.error(flowstr + "500 - Internal Error" + e);
					res.writeHead(500);
				}else{
					log.info(flowstr + "200OK:" + JSON.stringify(r));
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
		if(req.params.cid){
			_update(f, req.params.cid, req.body, function(e,r){
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
		if(req.query.cid){
			_delete(f, req.query.cid, function(e,r){
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
	},
	test: function (req, res, next){
		var f = res.locals.flowid;
		var flowstr = f + "-" + handler + "-" + "test:";
		log.info(flowstr + "starting");
		
		//try to connect to mysql connection
		log.info(flowstr + "testing connection... ");
		if(req.body.hostname.includes("storage:")){
			db.execution.test_conn_storage(flowstr, req.body.hostname, req.body.port, req.body.username, req.body.password, req.body.dbname, function(e,r){
				if(e){
					log.error(flowstr + "500 - Internal Error, " + e);
					res.writeHead(500, {'Content-type': ' application/json'});
					res.write(JSON.stringify(e));
				}else{
					log.info("connection closed gracefully");
					log.info(flowstr + "200OK: ");
					res.writeHead(200, {'Content-type': ' application/json'});
					res.write(JSON.stringify({msg:"Connection tested"}));
				}
				res.end();
			})
		}else{
			db.execution.test_conn(flowstr, req.body.hostname, req.body.username, req.body.password, req.body.dbname, function(e,r){
				if(e){
					log.error(flowstr + "500 - Internal Error, " + e);
					res.writeHead(500, {'Content-type': ' application/json'});
					res.write(JSON.stringify(e));
				}else{
					log.info("connection closed gracefully");
					log.info(flowstr + "200OK: ");
					res.writeHead(200, {'Content-type': ' application/json'});
					res.write(JSON.stringify({msg:"Connection tested"}));
				}
				res.end();
			})
		}
	},
	getFields: function (req,res,next){
		var f = res.locals.flowid;
		var flowstr = f + "-" + handler + "-" + "getFields:";
		log.info(flowstr + "starting");
		//get the connections params
		_getByTplId(flowstr, req.params.tid, function(e,r){
			if(e){
				res.writeHead(500);
				res.end();
			}else{
				if(r.length == 0){
					res.writeHead(404, {'Content-type': ' application/json'});
					res.write(JSON.stringify({error:"There is no Connection"}));
					res.end();
				}else{
					//get selected tables
					_getSelectedTables(flowstr, req.params.tid, function(e, selectedTablesList){
						if(e){
							cb(e)
						}else{
							if(selectedTablesList.length == 0){
								res.writeHead(404, {'Content-type': ' application/json'});
								res.write(JSON.stringify({error:"There is no Tables Selected"}));
								res.end();
							}else{
								let i = 0;
								if(r[0].hostname.includes("storage:")){
									//handle list of tables
									selectedTablesList.forEach(function(eachSelectedTable){
										db.execution.describe_table_storage(flowstr, r[0].hostname, r[0].port, r[0].username, r[0].password, r[0].dbname, eachSelectedTable.name, function(err,eachResult){
											if(err){
												log.error(err);
												eachSelectedTable.error = err;
												i++;
											}else{
												eachSelectedTable.fields = eachResult;
												i++;
											}
											if(i == selectedTablesList.length){
												log.info("We are done");
												log.info(JSON.stringify(selectedTablesList));
												res.writeHead(200, {'Content-type': ' application/json'});
												res.write(JSON.stringify(selectedTablesList));
												res.end();
											}
										})
									})
								}else{
									//handle list of tables
									selectedTablesList.forEach(function(eachSelectedTable){
										db.execution.describe_table(flowstr, r[0].hostname, r[0].username, r[0].password, r[0].dbname, eachSelectedTable.name, function(err,eachResult){
											if(err){
												log.error(err);
												eachSelectedTable.error = err;
												i++;
											}else{
												eachSelectedTable.fields = eachResult;
												i++;
											}
											if(i == selectedTablesList.length){
												log.info("We are done");
												log.info(JSON.stringify(selectedTablesList));
												res.writeHead(200, {'Content-type': ' application/json'});
												res.write(JSON.stringify(selectedTablesList));
												res.end();
											}
										})
									})
								}
							}
						}
					})
				}
			}
		})
	},
	getTables: function (req,res,next){
		var f = res.locals.flowid;
		var flowstr = f + "-" + handler + "-" + "getTables:";
		log.info(flowstr + "starting");

		//get the connections params
		_getByTplId(flowstr, req.params.tid, function(e,r){
			if(e){
				res.writeHead(500);
				res.end();
			}else{
				if(r.length == 0){
					res.writeHead(404, {'Content-type': ' application/json'});
					res.write(JSON.stringify({error:"There is no Connection"}));
					res.end();
				}else{
					if(r[0].hostname.includes("storage:")){
						db.execution.show_tables_storage(flowstr, r[0].hostname, r[0].port, r[0].username, r[0].password, r[0].dbname, function(err,result){
							if(err){
								res.writeHead(500);
								res.write(JSON.stringify(err));
							}else{
								let translate = [];
								let element = {};
								result.forEach(function (eachResult, resultIndex){
									element.table_name = eachResult;
									translate.push(element);
									element = {};
									if(resultIndex == result.length - 1){
										res.writeHead(200, {'Content-type': ' application/json'});
										res.write(JSON.stringify(translate));
									}
								})
							}
							res.end();
						})
					}else{
						db.execution.show_tables(flowstr, r[0].hostname, r[0].username, r[0].password, r[0].dbname, function(err,result,fields){
							if(err){
								res.writeHead(500);
								res.write(JSON.stringify(err));
							}else{
								let translate = [];
								let element = {};
								let i = 0;
								let j = 0;
								result.forEach(function (eachResult){
									for (var key in eachResult){
										if(key == ("Tables_in_"+r[0].dbname)) {
											element.table_name = eachResult[key]
										}else{
											element.table_type = eachResult[key];
										}
										i++;

										if(i == 2){
											translate.push(element);
											element = {};
											j++;
											i=0;	
										}
										if(j == result.length){
											res.writeHead(200, {'Content-type': ' application/json'});
											res.write(JSON.stringify(translate));
										}
									}
								})
							}
							res.end();
						})
					}
				}
			}
		})
	}
}