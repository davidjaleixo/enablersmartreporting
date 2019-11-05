var log = require('../../logger');
var handler = "db-tables";
var flow = require('../../common');



module.exports = function(pool, query, queryv){
	return {
		getByTplId: function(f, tid, cb){
			log.debug(f + "-" + handler + "-getByTplId:");
			query(f, "SELECT * FROM tables WHERE templates_idtemplates="+tid, function(e,r){
				if(e){
					cb(e);
				}else{
					cb(false, r);
				}
			});
		},
		create: function(f, payload, cb){
			log.debug(f + "-" + handler + "-create:");
			queryv(f, "INSERT INTO tables (name, templates_idtemplates) VALUES ?",[payload], function(e,r){
				if(e){
					cb(e);
				}else{
					cb(false, r);
				}
			})
		},
		delete: function(f, tid, cb){
			log.debug(f + "-" + handler + "-delete:");
			query(f, "DELETE FROM tables WHERE templates_idtemplates="+tid, function(e,r){
				if(e){
					cb(e);
				}else{
					cb(false, r);
				}
			})
		}
	}
}