var express = require('express');
var router = express.Router();
var IndexController = require('./app/controllers/IndexController');
var RoomController = require('./app/controllers/RoomController');
var MapController = require('./app/controllers/MapController');
var ApiController = require('./app/controllers/ApiController');

router.get('/', IndexController.landingPage);
router.get('/about', IndexController.about);
router.get('/map', MapController.show);
router.get('/room/:id', RoomController.show);

router.get('/api/room/:id', RoomController.show);
router.get('/api/rooms', RoomController.show);

module.exports = router;
