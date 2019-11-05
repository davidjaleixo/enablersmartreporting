'use strict';

var path = require('path');

module.exports = {
	base_url : "/api/vfosenabler/",
	api_version : "v1",
	FE_PATH : path.join(__dirname, '/fe'),
	BE_PATH : path.join(__dirname, '/be')
}
