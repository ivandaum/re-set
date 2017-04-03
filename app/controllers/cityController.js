var Controller = require('./Controller')
var cityController = new Controller();
var roomModel = require('../models/Room')

cityController.show = function(req, res) {
    console.log(roomModel.getAll());
};

module.exports = cityController;