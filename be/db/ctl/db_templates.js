var log = require('../../logger');
var handler = "db-templates";
var flow = require('../../common');



module.exports = function(pool, query){
	return {
		getByUserId: function(f, uid, cb){
			log.debug(f + "-" + handler + "-getById:");
			query(f, "SELECT * FROM templates WHERE owner='"+uid+"'", function(e,r){
				if(e){
					cb(e);
				}else{
					cb(false, r);
				}
			});
		},
		getByTplId: function(f, tid, cb){
			log.debug(f + "-" + handler + "-getByTplId:");
			query(f, "SELECT * FROM templates WHERE idtemplates="+tid+" Limit 1", function(e,r){
				if(e){
					cb(e);
				}else{
					cb(false, r);
				}
			});
		},
		create: function(f, payload, cb){
			log.debug(f + "-" + handler + "-create:");
			query(f, "INSERT INTO templates (owner,name) VALUES ( '"+payload.user +"','"+payload.tpl_name +"')", function(e,r){
				if(e){
					cb(e);
				}else{
					cb(false, r);
				}
			})
		},
		update: function(f, tid, obj, value, cb){
			log.debug(f + "-" + handler + "-update:");
			query(f, "UPDATE templates SET "+obj+"='"+value + "' WHERE idtemplates="+tid, function(e,r){
				if(e){
					cb(e);
				}else{
					cb(false, r);
				}
			})
		},
		delete: function(f, tid, cb){
			log.debug(f + "-" + handler + "-delete:");
			query(f, "DELETE FROM templates WHERE idtemplates="+tid, function(e,r){
				if(e){
					cb(e);
				}else{
					cb(false, r);
				}
			})
		},
		getOwners: function(f, cb){
			log.debug(f + "-" + handler + "-getOwners:");
			query(f, "SELECT distinct owner FROM templates", function(e,r){
				if(e){
					cb(e)
				}else{
					cb(false, r);
				}
			})
		}
	}
}