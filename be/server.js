// created by David Aleixo @ david.aleixo@knowledgebiz.pt


/* http server */

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var log = require('./logger');
var c = require('../const.js');
var path = require('path');
var cors = require('cors');

var port = process.env.PORT || 2000;
var handler = "server";


app.use(cors());
log.info(handler + " CORS is enabled");
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text({ type: 'text/plain' }));
app.use(methodOverride('X-HTTP-Method-Override'));

// set the static files location for the Angular project 
app.use(express.static(path.join(c.FE_PATH, 'sre-app/dist/sre-app')));


//Set the routes
require('./router')(app,log);

//listen port
app.listen(port);
log.info(handler + ' listening at port ' + port);


