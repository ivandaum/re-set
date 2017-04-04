var Controller = require('./Controller')
var RoomController = new Controller();
var model = require('../../config/db');

RoomController.show = function(req, res) {
    var layout = typeof req.query.nolayout == 'undefined' ? 'layout/layout' : false;
    var roomId = req.params.id;
    var page = {
      type:'room',
      id:roomId
    };

    model.RoomModel.get({_id:roomId}, function(room) {
      res.render('room',{room:room,layout:layout,page:JSON.stringify(page)});
    })
};

module.exports = RoomController;
