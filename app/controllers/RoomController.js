var Controller = require('./Controller')
var RoomController = new Controller();

RoomController.show = function(req, res) {
    console.log(req,res);
};

module.exports = RoomController;