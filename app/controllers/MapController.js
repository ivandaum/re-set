var Controller = require('./Controller')
var MapController = new Controller();
var model = require('../../config/db');

MapController = {
  showCity:function(req, res) {
    var page = {type:'map'};
    var layout = typeof req.query.nolayout == 'undefined' ? 'layout/layout' : false;
    model.RoomModel.get({}, function(rooms) {
      res.render('map',{rooms:rooms,layout:layout,page:JSON.stringify(page)});
    })
  }
}

module.exports = MapController;
