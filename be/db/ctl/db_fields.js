var log = require('../../logger');
var handler = "db-fields";
var flow = require('../../common');



module.exports = function(pool, query, queryv){
	return {
		getByTplId: function(f, tid, cb){
			log.debug(f + "-" + handler + "-getByTableId:");
			query(f, "SELECT fie.idfields, fie.name as fieldname, fie.aliases, tab.idtables, tab.name as tablename, tab.templates_idtemplates FROM fields as fie, tables as tab WHERE tab.idtables = fie.tables_idtables and tab.templates_idtemplates="+tid + " order by tab.name, fie.name", function(e,r){
				if(e){
					cb(e);
				}else{
					cb(false, r);
				}
			});
		},
		getByTableId: function(f, tid, cb){
			log.debug(f + "-" + handler + "-getByTableId:");
			query(f, "SELECT * FROM fields WHERE tables_idtables="+tid, function(e,r){
				if(e){
					cb(e);
				}else{
					cb(false, r);
				}
			});
		},
		create: function(f, payload, cb){
			log.debug(f + "-" + handler + "-create:");
			queryv(f, "INSERT INTO fields (name, aliases, tables_idtables) VALUES ?", [payload], function(e,r){
				if(e){
					cb(e)
				}else{
					cb(false, r);
				}
			})
		},
		delete: function(f, tableid, cb){
			log.debug(f + "-" + handler + "-delete:");
			query(f, "DELETE FROM fields WHERE tables_idtables="+tableid, function(e,r){
				if(e){
					cb(e)
				}else{
					cb(false,r);
				}
			})
		}
	}
}