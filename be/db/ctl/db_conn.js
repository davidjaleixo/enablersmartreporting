var log = require('../../logger');
var handler = "db-conn";
var flow = require('../../common');


module.exports = function(pool, query){
	return {
		getById: function(f, cid, cb){
			log.debug(f + "-" + handler + "-getById:");
			query(f, "SELECT * FROM connections WHERE idconnections="+cid, function(e,r){
				if(e){
					cb(e);
				}else{
					cb(false, r);
				}
			});
		},
		getByTplId: function(f, tid, cb){
			log.debug(f + "-" + handler + "-getByTplId:");
			query(f, "SELECT * FROM connections WHERE templates_idtemplates="+tid, function(e,r){
				if(e){
					cb(e);
				}else{
					cb(false, r);
				}
			});
		},
		create: function(f, payload, cb){
			log.debug(f + "-" + handler + "-create:");
			query(f, "INSERT INTO connections (hostname,port,username,password,dbname,templates_idtemplates) VALUES ( '"+payload.hostname +"',"+payload.port +",'"+payload.username+"','"+payload.password+"','"+payload.dbname+"',"+payload.tpl_id+")", function(e,r){
				if(e){
					cb(e,null);
				}else{
					cb(false, r);
				}
			})
		},
		update: function(f, cid, obj, value, cb){
			log.debug(f + "-" + handler + "-update:");
			query(f, "UPDATE connections SET "+obj+"='"+value + "' WHERE idconnections="+cid, function(e,r){
				if(e){
					cb(e);
				}else{
					cb(false, r);
				}
			})
		},
		delete: function(f, cid, cb){
			log.debug(f + "-" + handler + "-delete:");
			query(f, "DELETE FROM connections WHERE idconnections="+cid, function(e,r){
				if(e){
					cb(e);
				}else{
					cb(false, r);
				}
			})
		}
	}
}