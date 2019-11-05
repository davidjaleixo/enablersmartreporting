//Made by David Aleixo @ david.aleixo@knowledgebiz.pt
var handler = "ctl-headers";
var log 	= require('../logger');
var db 		= require('../db');
var flow 	= require('../common');
var FS 		= require('fs');
var c 		= require('../../const');


var _getById = function(f, hid, cb){
	var flowstr = f + "-" + handler + "-" + "_getById:";
	log.debug(flowstr);
	db.headers.getById(f, hid, function(e,r){
		if(e){
			log.debug(flowstr + "error:" + e)
			cb(e);
		}else{
			log.info(flowstr + "result:");
			cb(false,r);
		}
	})
}
var _getByTplId = function(f, tid, cb){
	var flowstr = f + "-" + handler + "-" + "_getByTplId:";
	log.debug(flowstr);
	db.headers.getByTplId(f, tid, function(e,r){
		if(e){
			log.debug(flowstr + "error:" + e);
			cb(e)
		}else{
			log.info(flowstr + "result:");
			cb(false, r);
		}
	})
}

var _upload = function(f, tid, file, cb){
	var flowstr = f + "-" + handler + "-" + "_create:";
	log.debug(flowstr);
	//db.headers.store(f, {html: file, filename:filename, templates_idtemplates: tid}, function(e,r){
	db.headers.store(f, {html: file, templates_idtemplates: tid}, function(e,r){
		if(e){
			log.error(flowstr + "error:" + e);
			cb(e)
		}else{
			log.info(flowstr + "result:" + e);
			cb(false, r);
		}
	})
}
var _update = function(f, hid, file, cb){
	var flowstr = f + "-" + handler + "-" + "_update:";
	log.debug(flowstr);
	db.headers.update(f, {html: file, hid: hid}, function(e,r){
		if(e){
			log.error(flowstr + "error:" + e);
			cb(e)
		}else{
			log.info(flowstr + "result:" + e);
			cb(false, r);
		}
	})
}

module.exports = {
	get : function(req, res, next){
		var f = res.locals.flowid;
		var flowstr = f + "-" + handler + "-" + "create:";
		log.info(flowstr + "starting");
		if(req.params.tid){
			//filter the headers by it's id
			if(req.query.hid){
				_getById(f, req.query.hid, function(e,r){
					if(e){
						log.error(flowstr + "500 - Internal Error:" + e);
						res.writeHead(500);
						//res.end();
					}else{
						if(r.length > 0){
							log.info(flowstr + "200OK:");
							//res.writeHead(200, {'Content-type': ' application/json'});
							//res.write(JSON.stringify(r));
							/*var path = c.FRONTEND_PATH+"/public/"+r[0].filename+".html";
							console.log("writing file... " + path);
							try {
								FS.writeFileSync(path, r[0].html);
							}catch(e){console.log(e)}
							
							console.log("serving file... " + path);
							res.download(path, function(e){
								console.log(e)
							});
							console.log("served!");
							*/
							//reply data
							res.writeHead(200,{'Content-type': 'arraybuffer'});
							res.write(JSON.stringify(r)[0]);

						}else{
							log.info(flowstr + "404 - Resource not found");
							res.writeHead(404);
							//res.end();
						}
					}
					res.end();
					
				})
			}else{
				//dont filter, get all headers by template id
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
			}
			
		}else{
			//bad request
			log.info(flowstr + "400 - Bad request");
			res.write(400);
			res.end();
		
		}
	},
	upload : function(req, res, next){
		var f = res.locals.flowid;
		var flowstr = f + "-" + handler + "-" + "upload:";
		log.info(flowstr + "starting");
		log.debug("files:",req.files);
		log.debug("file:",req.file);
		log.debug("body:",req.body);
		if(req.file){

			_upload(f, req.params.tid, FS.readFileSync(req.file.path), function(e,r){
				if(e){
					log.error(flowstr + "500 - Internal Error" + e);
					res.writeHead(500);
				}else{
					log.info(flowstr + "200OK:" + JSON.stringify(r));
					res.writeHead(200, {'Content-type': ' application/json'});
					res.write(JSON.stringify({msg: "File uploaded", id: r.insertId}));
				}
				//delete file
				FS.unlink(req.file.path);
				res.end();
			})
		}
	},
	create : function(req, res, next){
		var f = res.locals.flowid;
		var flowstr = f + "-" + handler + "-" + "create:";
		log.info(flowstr + "starting");
		if(req.body){
			var path = c.BE_PATH+"/uploads/tmp.html"
			FS.writeFileSync(path, req.body);
			_upload(f, req.params.tid, FS.readFileSync(path), function(e,r){
				if(e){
					log.error(flowstr + "500 - Internal Error" + e);
					res.writeHead(500);
				}else{
					log.info(flowstr + "200OK:" + JSON.stringify(r));
					res.writeHead(200, {'Content-type': ' application/json'});
					res.write(JSON.stringify({msg: "Created", id: r.insertId}));
				}
				//delete file
				FS.unlink(path);
				res.end();
			})
		}
	},
	update: function(req, res, next){
		var f = res.locals.flowid;
		var flowstr = f + "-" + handler + "-" + "update:";
		log.info(flowstr + "starting");
		var path = c.BE_PATH+"/uploads/tmp.html"
		FS.writeFileSync(path, req.body);
		_update(f, req.params.hid, FS.readFileSync(path), function(e,r){
			try{
				if(e){
						log.error(flowstr + "500 - Internal Error" + e);
						res.writeHead(500);
						throw e;
					}else{
						log.info(flowstr + "200OK:" + JSON.stringify(r));
						res.writeHead(200, {'Content-type': ' application/json'});
						res.write(JSON.stringify({msg: "updated", id: r.affectedRows}));
					}
					//delete file
					FS.unlink(path);
					res.end();
			}catch(e){
				res.writeHead(500);
				res.end();
			}
		})
	}



}