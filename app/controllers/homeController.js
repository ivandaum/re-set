var Controller = require('./Controller')
var IndexController = new Controller();

IndexController.landingPage = function(req, res) {
    res.render('home', { title: 'Final project',layout:'layout/layout'});
};

IndexController.tutorial = function(req, res) {
    res.render('tutorial', { title: 'Tutorial',layout:'layout/layout'});
}

module.exports = IndexController;