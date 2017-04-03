var express = require('express');
var router = express.Router();
var IndexController = require('./app/controllers/homeController');
var roomController = require('./app/controllers/roomController');
var cityController = require('./app/controllers/cityController');

/* GET home page. */
router.get('/', IndexController.landingPage);
router.get('/tutorial', IndexController.tutorial);
router.get('/map', cityController.show);
router.get('/room/:id', roomController.show);
router.post('/room', function(req, res) {
    var name = req.body.name
    res.render('room', { title: 'Final project' });
});

module.exports = router;
