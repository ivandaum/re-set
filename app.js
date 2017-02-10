const APP_PATH = 'app'
const PUBLIC_PATH = 'public'

const ejs = require('ejs')
const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const http = require('http')
const path = require('path')
const routes = require('./routes/index')
const sassMiddleware = require('node-sass-middleware')
const app = express()
app.use('/css', sassMiddleware({
    src: __dirname + '/'+PUBLIC_PATH+'/css',
    dest: __dirname + '/'+PUBLIC_PATH+'/css',
    debug: true,
    outputStyle: 'compressed'
}));
// ------- VIEWS
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
const server = http.createServer(app)
const port = process.env.PORT || '3000'

app.set('port', port)
server.listen(port)
