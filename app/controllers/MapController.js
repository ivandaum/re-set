var Controller = require('./Controller')
var MapController = new Controller();
var model = require('../../config/db');

MapController = {
  showCity:function(req, res) {
    model.RoomModel.get({}, function(rooms) {
      res.render('map',{rooms:rooms,layout:'layout/layout'});
    })
  }
}

module.exports = MapController;
