var ejs = require('ejs')
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var path = require('path');
var routes = require('./routes/index')
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/', routes);

var server = http.createServer(app);


var port = process.env.PORT || '3000'
app.set('port', port);
server.listen(port);
