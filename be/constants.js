var path = require('path');

module.exports = {
	base_url : "/api/vfosenabler/",
	api_version : "v1",
	fe_path: path.normalize(__dirname + '/fe'),
	public_path : path.normalize(__dirname + '/fe') + "/public"
}