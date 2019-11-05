var log = require('../../logger');
var handler = "db-execution";
var flow = require('../../common');
var mysql = require('mysql');
var request = require('request');

var dbconnect = function(f, h, u, p, db, cb){
	let connection = mysql.createConnection({
		host: h,
		user: u,
		password: p,
		database: db
	});
	connection.connect(function(e){
		if(e){
			log.error(f + e);
			cb(e);
		}else{
			log.info(f + "connected successfully, now closing connection...");
			connection.end(function(e){
				if(e){
					log.error(f + "500 - Internal Error, " + e);
					cb(true)
				}else{
					log.info("connection closed gracefully");
					log.info(f + "OK");
					cb(false, {msg:"Connection tested"})
				}
			})
		}
	})
}

var dbconnectStorage = function(f, h, port, u, p, db, cb){
	var hostname = h.slice(8);
	var auth = "Basic " + new Buffer(u + ":" + p).toString("base64"); 
	var Requestoptions = {
		url: hostname + ':'+port+'/vfos/rel/1.0.1/databases',
		method: 'POST',
		headers: {
			"Content-Type": "application/json",
			"Accept": "application/json",
			"Authorization": auth
		},
		body: db
	}
	request(Requestoptions, function (error, response,body) {
		if (!error) {
			if(response.statusCode == 409){
				log.info("connection closed gracefully");
				log.info(f + "OK");
				cb(false, {msg:"Connection tested"})
			}else{
				var Requestoptions = {
					url: hostname + ':'+port+'/vfos/rel/1.0.1/databases/'+db,
					method: 'DELETE',
					headers: {
						"Content-Type": "application/json",
						"Accept": "application/json",
						"Authorization": auth
					}
				}
				request(Requestoptions, function (error, response,body) {
					if (error) {
						log.error(f + "500 - Internal Error, " + JSON.stringify(response));
						cb(true)
					}else{
						log.error(f + "500 - Internal Error, " + JSON.stringify(response));
						cb(true)
					}
				})
			}
		}else{
			log.error(f + "500 - Internal Error, " + error);
			cb(true)
		}
	})
}

var usage = function(i, h, u, p, db, q, cb){
	let conn = mysql.createConnection({
		host: h,
		user: u,
		password: p,
		database: db
	});
	log.info(i + "-trying to connect to external DB...")
	try{
		conn.connect(function(e){
			if(e){
				log.error(i + "-Error" + JSON.stringify(e));
				cb(e)
			}else{
				conn.query(q, function(e,r,f){
					log.debug(i + ":results:" + JSON.stringify(r) + ":fields:" + JSON.stringify(f));
					cb(false, r, f);
				})
			}
		})
	}catch(e){
		log.error(i + "-catched error" + JSON.stringify(e));
		cb(e);
	}
}

var usageStorage = function(i, h, port, u, p, db, tname, url, cb){
	var hostname = h.slice(8);
	var auth = "Basic " + new Buffer(u + ":" + p).toString("base64"); 
	if(tname == null && url == null){
		var Requestoptions = {
			url: hostname + ':'+port+'/vfos/rel/1.0.1/databases/'+db+'/tables',
			method: 'GET',
			headers: {
				"Content-Type": "application/json",
				"Accept": "application/json",
				"Authorization": auth
			}
		}
	}else if(url == null && tname != null){
		var Requestoptions = {
			url: hostname + ':'+port+'/vfos/rel/1.0.1/databases/'+db+'/tables/'+tname,
			method: 'GET',
			headers: {
				"Content-Type": "application/json",
				"Accept": "application/json",
				"Authorization": auth
			}
		}
	}else if(tname == null && url != null){
		var Requestoptions = {
			url: url,
			method: 'GET',
			headers: {
				"Content-Type": "application/json",
				"Accept": "application/json",
				"Authorization": auth
			}
		}
	}
	request(Requestoptions, function (error, response,body) {
		if(error){
			log.error(i + "-Error" + JSON.stringify(error));
			cb(error)
		}else{
			if(response.statusCode == 200){
				if(tname == null && url == null){
					json = JSON.parse(response.body);
					log.debug(i + ":results:" + JSON.stringify(json));
					cb(false,json.list);
				}else if(url == null && tname != null){
					json = JSON.parse(response.body);
					log.debug(i + ":results:" + JSON.stringify(json));
					json.col_def.forEach(function(eachField){
						eachField.Field = eachField.name;
						delete eachField.name;
					})
					cb(false,json.col_def);
				}else if(tname == null && url != null){
					json = JSON.parse(response.body);
					cb(false,json.list_of_rows);
				}
			}
		}
	})
}


module.exports = function(pool, query, queryv){
	return {
		test_conn: function(i, h, u, p, db, cb){
			dbconnect(i,h,u,p,db,function(e,r){
				if(e){
					cb(e)
				}else{
					cb(false, r);
				}
			})
		},
		test_conn_storage: function(f, h, port, u, p, db, cb){
			dbconnectStorage(f,h,port,u,p,db,function(e,r){
				if(e){
					cb(e)
				}else{
					cb(false, r);
				}
			})
		},
		show_tables: function(i, h, u, p, db, cb){
			log.debug(i + "-" + handler + "-show_tables:");
			usage(i,h,u,p,db,"SHOW FULL TABLES", function(e,r,f){
				if(e){
					cb(e);
				}else{
					cb(false,r,f);
				}
			})
		},
		show_tables_storage: function(i, h, port, u, p, db, cb){
			log.debug(i + "-" + handler + "-show_tables:");
			usageStorage(i,h,port,u,p,db,null,null, function(e,r){
				if(e){
					cb(e);
				}else{
					cb(false,r);
				}
			})
		},
		describe_table: function(i, h, u, p, db, tname, cb){
			log.debug(i + "-" + handler + "-describe_table:" + tname);
			usage(i,h,u,p,db,"DESCRIBE "+tname, function(e,r,f){
				if(e){
					cb(e)
				}else{
					cb(false,r,f);
				}
			})
		},
		describe_table_storage: function(i, h, port, u, p, db, tname, cb){
			log.debug(i + "-" + handler + "-describe_table:" + tname);
			usageStorage(i,h,port,u,p,db,tname, null, function(e,r){
				if(e){
					cb(e)
				}else{
					cb(false,r);
				}
			})
		},
		query: function(i, h, u, p, db, q, cb){
			log.debug(i + "-" + handler + "-query:");
			usage(i,h,u,p,db,q, function(e,r,f){
				if(e){
					cb(e)
				}else{
					cb(false,r,f);
				}
			})
		},
		queryStorage: function(i, h, port, u, p, url, cb){
			log.debug(i + "-" + handler + "-query:");
			var split = url.split("/");

			usageStorage(i,h,port,u,p,null,null,url, function(e,r){
				if(e){
					cb(e)
				}else{
					split.forEach(function(eachSplit, index){
						if(eachSplit == "tables"){
							cb(false,r, split[index + 1]);
						}
					})
				
				}
			})
		}
	}
}