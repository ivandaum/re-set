var model = require('../../config/db');

var ApiController = {
	getRooms:function(req, res) {
		model.RoomModel.get({}, function(rooms) {
			res.send(JSON.stringify({rooms:rooms}));
		})
	},
	getRoom: function(req,res) {
		var roomId = req.params.id;

		model.RoomModel.get({_id:roomId}, function(room) {
			res.send(JSON.stringify({room:room}));
		})
	}
};

module.exports = ApiController;
