var mysql = require('mysql');
var dbconf = require('./conf')
var flow = require('../common');
var handler = "DB";
var pool = mysql.createPool(dbconf)

var query = function(f, q, cb){
	log.debug(f + "-db-query:Executing query " + q);
	if(pool){
		pool.getConnection(function(e, c){
			if(e){
				log.error(f + "-db-query:" + e);
				cb(e);
			}
			log.debug(f + "-db-query:Connection " + c.threadId);
			c.query(q, function(e,r){
				c.release();
				if(!e){
					log.debug(f + "-db-query:result:", r);
					cb(false, r);
				}else{
					log.error(f + "-DB-query:",e);
					cb(e);
				}
			})
			c.on('error', function(e){
				log.error(f+"-db-query:Event listener:Error on db connection: " + e);
			})
		})
	}
};

var queryv = function(f, q, v, cb){
	log.debug(f + "-db-query-values:Executing query " + q + " with values: " + JSON.stringify(v));
	if(pool){
		pool.getConnection(function(e, c){
			if(e){
				log.error(f + "-db-query:" + e);
				cb(e);
			}
			log.debug(f + "-db-query:Connection " + c.threadId);
			c.query(q, v, function(e,r){
				c.release();
				if(!e){
					log.debug(f + "-db-query-values:result:", r);
					cb(false, r);
				}else{
					log.error(f + "-DB-query-values:",e);
					cb(e);
				}
			})
			c.on('error', function(e){
				log.error(f+"-db-query-values:Event listener:Error on db connection: " + e);
			})
		})
	}
}

module.exports = {
	pool : pool,
	query: query,
	queryv: queryv,

	//DB controllers
	common 		: require('./ctl/db_common')(pool, query),
	templates 	: require('./ctl/db_templates')(pool, query),
	conn 		: require('./ctl/db_conn')(pool, query),
	headers 	: require('./ctl/db_headers')(pool, query, queryv),
	footers 	: require('./ctl/db_footers')(pool, query, queryv),
	execution 	: require('./ctl/db_execution')(pool, query, queryv),
	tables 		: require('./ctl/db_tables')(pool, query, queryv),
	fields 		: require('./ctl/db_fields')(pool, query, queryv),
	filters 	: require('./ctl/db_filters')(pool, query, queryv),
	relations	: require('./ctl/db_relations')(pool, query, queryv)

};