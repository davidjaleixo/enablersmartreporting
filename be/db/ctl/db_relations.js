var log = require('../../logger');
var handler = "db-relations";
var flow = require('../../common');



module.exports = function(pool, query, queryv){
	return {
		getByTemplateId: function(f, tid, cb){
			log.debug(f + "-" + handler + "-getByTemplateId:");
			query(f, "SELECT rel.idrelations, rel.lefttable, rel.leftfield, rel.righttable, rel.rightfield, rel.templates_idtemplates FROM relations as rel WHERE rel.templates_idtemplates="+tid + " order by rel.idrelations", function(e,r){
				if(e){
					cb(e);
				}else{
					cb(false, r);
				}
			});
		},
		create: function(f,payload, cb){
			log.debug(f + "-" + handler + "-create:");
			queryv(f, "INSERT INTO relations (lefttable, leftfield, righttable, rightfield, templates_idtemplates) VALUES ?", [payload], function(e,r){
				if(e){
					cb(e)
				}else{
					cb(false, r);
				}
			})
		},
		delete: function(f,rid, cb){
			log.debug(f + "-" + handler + "-delete:");
			query(f, "DELETE FROM relations WHERE idrelations="+rid, function(e,r){
				if(e){
					cb(e)
				}else{
					cb(false,r);
				}
			})
		}
	}
}