var log = require('../../logger');
var handler = "db-filters";
var flow = require('../../common');



module.exports = function(pool, query, queryv){
	return {
		getByTemplateId: function(f, tid, cb){
			log.debug(f + "-" + handler + "-getByTemplateId:");
			query(f, "SELECT fil.idfilters, fil.cond, fil.value, fil.fields_idfields, fie.idfields, fie.name as fieldname, fie.aliases, fie.tables_idtables, tab.idtables, tab.name as tablename, tab.templates_idtemplates FROM filters as fil, fields as fie, tables as tab WHERE fil.fields_idfields = fie.idfields and fie.tables_idtables = tab.idtables and tab.templates_idtemplates="+tid + " order by tab.name", function(e,r){
				if(e){
					cb(e);
				}else{
					cb(false, r);
				}
			});
		},
		create: function(f,payload, cb){
			log.debug(f + "-" + handler + "-create:");
			queryv(f, "INSERT INTO filters (cond, value, fields_idfields) VALUES ?", [payload], function(e,r){
				if(e){
					cb(e)
				}else{
					cb(false, r);
				}
			})
		},
		delete: function(f,fid, cb){
			log.debug(f + "-" + handler + "-delete:");
			query(f, "DELETE FROM filters WHERE idfilters="+fid, function(e,r){
				if(e){
					cb(e)
				}else{
					cb(false,r);
				}
			})
		}
	}
}