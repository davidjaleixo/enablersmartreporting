var middleware = require('./middleware');
const c = require('../const.js'); 
var ctl = require('./ctl');
var path = require('path');


module.exports = function(app, log){
	//middleware configuration
	app.use(middleware.flowtracker);
	app.use(middleware.requestlogger);
	//app.use(middleware.fileupload());
	app.use(
		middleware.multer({
			dest: "./uploads/"
		}).single('srefile')
	);

	//routes
	//TODO - DELETE THIS SHIT :)
	app.get(c.base_url+c.api_version+'/test',function(req,res){
		res.writeHead(200, {'Content-type': ' application/json'}); 
		res.end();
	})

	//1. templates
	app.get(c.base_url + c.api_version + '/templates/:owner', ctl.templates.get);
	app.get(c.base_url + c.api_version + '/templates/info/:tid', ctl.templates.getInfo);
	app.post(c.base_url + c.api_version + '/templates', ctl.templates.create);
	app.patch(c.base_url + c.api_version + '/templates', ctl.templates.update);
	app.delete(c.base_url + c.api_version + '/templates/:tid', ctl.templates.delete);

	//get all owners found
	app.get(c.base_url + c.api_version + '/owners', ctl.owners.get);

	//2. common
	app.get(c.base_url + c.api_version + '/templates', ctl.common.get);
	app.post(c.base_url + c.api_version + '/templates', ctl.common.create);
	app.patch(c.base_url + c.api_version + '/templates', ctl.common.update);
	app.delete(c.base_url + c.api_version + '/templates', ctl.common.delete);


	//3. connections
	app.get(c.base_url + c.api_version + '/conn/:tid', ctl.conn.get);
	app.post(c.base_url + c.api_version + '/conn', ctl.conn.create);
	app.patch(c.base_url + c.api_version + '/conn/:cid', ctl.conn.update);
	app.delete(c.base_url + c.api_version + '/conn', ctl.conn.delete);
	app.post(c.base_url + c.api_version + '/conn/test', ctl.conn.test);
	app.get(c.base_url + c.api_version + '/conn/:tid/tables', ctl.conn.getTables);
	app.get(c.base_url + c.api_version + '/conn/:tid/fields', ctl.conn.getFields);
	
	//3.1 connection execution
	
	
	//4. headers
	app.get(c.base_url + c.api_version + '/headers/:tid', ctl.headers.get);
	app.post(c.base_url + c.api_version + '/headers/:tid/upload', ctl.headers.upload);
	app.post(c.base_url + c.api_version + '/headers/:tid', ctl.headers.create);
	app.patch(c.base_url + c.api_version + '/headers/:hid', ctl.headers.update);

	//5. tables
	app.get(c.base_url + c.api_version + '/tables/:tid', ctl.tables.get);
	app.delete(c.base_url + c.api_version + '/tables/:tid', ctl.tables.delete);
	app.post(c.base_url + c.api_version + '/tables', ctl.tables.create);

	//6. fields
	app.get(c.base_url + c.api_version + '/fields/:tableid', ctl.fields.get);
	app.get(c.base_url + c.api_version + '/fields/:tid/bytemplate', ctl.fields.getByTpl);
	app.post(c.base_url + c.api_version + '/fields', ctl.fields.create);
	app.delete(c.base_url + c.api_version + '/fields/:tableid', ctl.fields.delete);

	//7. filters
	app.get(c.base_url + c.api_version + '/filters/:tid', ctl.filters.get);
	app.post(c.base_url + c.api_version + '/filters', ctl.filters.create);
	app.delete(c.base_url + c.api_version + '/filters/:fid', ctl.filters.delete);

	//8. footers
	app.get(c.base_url + c.api_version + '/footers/:tid', ctl.footers.get);
	app.post(c.base_url + c.api_version + '/footers/:tid/upload', ctl.footers.upload);
	app.post(c.base_url + c.api_version + '/footers/:tid', ctl.footers.create);
	app.patch(c.base_url + c.api_version + '/footers/:hid', ctl.footers.update);

	//9. relations
	app.get(c.base_url + c.api_version + '/relations/:tid', ctl.relations.get);
	app.post(c.base_url + c.api_version + '/relations', ctl.relations.create);
	app.delete(c.base_url + c.api_version + '/relations/:rid', ctl.relations.delete);

	//logic
	app.get(c.base_url + c.api_version + '/execute/:tid', ctl.execution.storage);


	//Putting Angular togheter with express
	app.get('*', function(res, res){
		res.sendFile('index.html', {root: path.join(c.FE_PATH, '/sre-app/dist/sre-app')});
	})
}