var Controller = require('./Controller')
var IndexController = new Controller();

IndexController.landingPage = function(req, res) {
    var page = {type:'index'};
    res.render('home', { layout:'layout/layout', page: JSON.stringify(page)});
};

module.exports = IndexController;
