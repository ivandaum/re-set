var Controller = require('./Controller');
var IndexController = new Controller();

IndexController.landingPage = function(req, res) {
    var layout = typeof req.query.nolayout == 'undefined' ? 'layout/layout' : false;
    var page = {type:'index'};
    res.render('home', { layout:layout, page: JSON.stringify(page)});
};
IndexController.about = function(req,res) {
    var page = {type:'about'};
    var layout = typeof req.query.nolayout == 'undefined' ? 'layout/layout' : false;
    res.render('about', { layout:layout, page: JSON.stringify(page)});
};

module.exports = IndexController;
