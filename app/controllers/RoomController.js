var Controller = require('./Controller')
var roomController = new Controller();

roomController.show = function(req, res) {
    console.log(req,res);
};

module.exports = roomController;