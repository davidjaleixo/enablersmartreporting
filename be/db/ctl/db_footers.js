var log = require('../../logger');
var handler = "db-footers";
var flow = require('../../common');



module.exports = function(pool, query, queryv){
	return {
		getById: function(f, hid, cb){
			log.debug(f + "-" + handler + "-getById:");
			query(f, "SELECT * FROM footers WHERE idheaders="+hid, function(e,r){
				if(e){
					cb(e);
				}else{
					cb(false, r);
				}
			});
		},
		getByTplId: function(f, tid, cb){
			log.debug(f + "-" + handler + "-getByTplId:");
			query(f, "SELECT * FROM footers WHERE templates_idtemplates="+tid, function(e,r){
				if(e){
					cb(e);
				}else{
					cb(false, r);
				}
			});
		},
		store: function(f, payload, cb){
			log.debug(f + "-" + handler + "-create:");
			queryv(f, "INSERT INTO footers SET ?", payload, function(e,r){
				if(e){
					cb(e,null);
				}else{
					cb(false, r);
				}
			})
		},
		update: function(f, payload, cb){
			log.debug(f + "-" + handler + "-update:");
			query(f, "UPDATE footers SET html = '" + payload.html + "' WHERE idfooters=" + payload.hid, function(e,r){
				if(e){
					cb(e);
				}else{
					cb(false, r);
				}
			})
		},
		delete: function(f, tid, cb){
			log.debug(f + "-" + handler + "-delete:");
			query(f, "DELETE FROM footers WHERE templates_idtemplates="+tid, function(e,r){
				if(e){
					cb(e);
				}else{
					cb(false, r);
				}
			})
		}
	}
}