var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    var error = []
    console.log(req.connection);
    res.render('index', { title: 'Final project',layout:'layout/layout'});
});
// router.get('/room', function(req, res) {
//   res.redirect('/');
// });
// router.post('/room', function(req, res) {
//     var name = req.body.name
//     res.render('room', { title: 'Final project' });
//
// });

module.exports = router;
