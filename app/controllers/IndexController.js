var Controller = require('./Controller')
var IndexController = new Controller();

IndexController.landingPage = function(req, res) {
    res.render('home', { layout:'layout/layout'});
};

module.exports = IndexController;
