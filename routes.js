var express = require('express');
var router = express.Router();
var IndexController = require('./app/controllers/IndexController');
var RoomController = require('./app/controllers/RoomController');
var MapController = require('./app/controllers/MapController');

router.get('/', IndexController.landingPage);
router.get('/room/:id', RoomController.show);
router.get('/map', MapController .show);

module.exports = router;
