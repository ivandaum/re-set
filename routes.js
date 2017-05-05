var express = require('express');
var router = express.Router();
var IndexController = require('./app/controllers/IndexController');
var ApiController = require('./app/controllers/ApiController');

router.get('/api/room/:id', ApiController.getRoom);
router.get('/api/room/:id/interactions', ApiController.getRoomWithInteractions);
router.get('/api/rooms', ApiController.getRooms);
router.get('/', IndexController.landingPage);
router.get('/room/:id', IndexController.straightToRoom);

module.exports = router;
