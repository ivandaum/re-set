const APP_PATH = 'app'
const PUBLIC_PATH = 'public'
const ejs = require('ejs')
const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const http = require('http')
const path = require('path')
const partials = require('express-partials')
const app = express()
const port = process.env.PORT || '3000'
const routes = require('./routes')


// ------- VIEWS
app.use(partials());
app.set('views', path.join(__dirname, APP_PATH + '/views'))
app.set('view engine', 'ejs')

// ------- ROUTES & COOKIES
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser());

// ------- ROUTES
app.use('/public', express.static(path.join(__dirname, PUBLIC_PATH)));
app.use('/', routes)

// ------- SERVER CONFIG
app.set('port', port)

const server = http.createServer(app)
const io = require('socket.io')(server);
require('./sockets/server')(io);

server.listen(port, function() {})

server.on('error', function(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
})
