/*module.exports = {
	host 			: "localhost",
	user 			: "root",
	password 		: "root",
	database 		: "sre",
	debug 			: false,
	connectionLimit : 100
}
*/
module.exports = {
	//host 			: "localhost",	//out of docker usage
	host			: "db",			//docker usage db service
	user 			: "sreuser",
	password 		: "srepassword",
	database 		: "sre",
	debug 			: false,
	connectionLimit : 100
}
