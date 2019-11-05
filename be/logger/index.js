const winston = require('winston');


module.exports = log = winston.createLogger({
	level: 'debug',
	transports: [
      new winston.transports.Console({format: winston.format.combine(
	    winston.format.colorize(),
	    winston.format.simple()
	)}),
      new winston.transports.File(
      	{ 
      		filename: 'sre.log',
	    	timestamp: function () {
	    		return new Date();
	    	}
		}),
      new winston.transports.File({
      	filename: 'sre-error.log',
      	level: 'error',
      	timestamp: function () {
	    		return new Date();
	    	}
      })
    ]
});
