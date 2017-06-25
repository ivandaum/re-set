var model = require('../../config/db');
ObjectId = require('mongodb').ObjectID;

var ApiController = {
	getRooms:function(req, res) {
		model.RoomModel.get({}, function(rooms) {
			res.send(JSON.stringify({rooms:rooms}));
		})
	},
	getInteractions: function(req, res) {
		model.InteractionModel.get({},function(interactions) {
			res.send(JSON.stringify({interactions:interactions}));
		})
	},
	getRoomInteractions: function(req, res) {
		var roomId = req.params.id;
		model.InteractionModel.get({"room_id":ObjectId(roomId)},function(interactions) {
			res.send(JSON.stringify({interactions:interactions}));
		})
	},
	getRoom: function(req,res) {
		var roomId = req.params.id;
		model.RoomModel.get({"_id":ObjectId(roomId)}, function(room) {
			res.send(JSON.stringify({room:room}));
		})
	},
	getRoomWithInteractions: function(req,res) {
		var roomId = req.params.id;
		model.RoomModel.get({"_id":ObjectId(roomId)}, function(room) {
			model.InteractionModel.get({"room_id":ObjectId(roomId)},function(interactions) {
				res.send(JSON.stringify({interactions:interactions,room:room}));
			})
		})
	}
};

module.exports = ApiController;
