var express = require('express');
var router = express.Router();
var IndexController = require('./app/controllers/IndexController');
var RoomController = require('./app/controllers/RoomController');
var MapController = require('./app/controllers/MapController');

router.get('/', function(req,res) {
  IndexController.landingPage(req,res)
});
router.get('/room/:id', function(req,res) {
  RoomController.show(req,res)
});
router.get('/map', function(req,res) {
  MapController.showCity(req,res)
});

module.exports = router;
