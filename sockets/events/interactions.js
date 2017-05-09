var model = require("../../config/db");
ObjectId = require('mongodb').ObjectID;
var InteractionSocket = require('../models/Interaction');

exports.init = function(io,client,user,users,interactions) {
	function userStartInteraction(objectId) {


		user.object3DId = objectId;
		if(typeof interactions[objectId] == 'undefined') {

			model.InteractionModel.get({_id:ObjectId(objectId)}, function(interaction) {

				// If already finish, we do not load it
				// if(interaction[0].is_finish == true) {
				// 	return false;
				// }

				interactions[objectId] = new InteractionSocket(objectId, interaction[0].people_required);
				interactions[objectId].userList.push(user.id);

				io.to(user.room).emit('user:interaction:start',{user:user.id,object:objectId});

				interactionIsComplete(objectId);
			});

		} else {
			io.to(user.room).emit('user:interaction:start',{user:user.id,object:objectId});
			interactions[objectId].userList.push(user.id);
			interactionIsComplete(objectId);
		}
	}

	function userStopInteraction() {

		var object = user.object3DId;

		if(!interactions[object]) return false;

		// Looking for user an removing it from user on this interaction
		for(var i=0; i<interactions[object].userList.length; i++) {

			var userInList = interactions[object].userList[i];

			if(userInList == user.id) {

				delete interactions[object].userList[i];
				break;
			}
		}

		user.object3DId = null;
		io.to(user.room).emit('user:interaction:stop',{user:user.id,object:object});
	}


	function interactionIsComplete(objectId) {

		if(interactions[objectId].people_required <= interactions[objectId].userList.length) {

			model.InteractionModel.setComplete(ObjectId(objectId), function(data) {

				delete interactions[objectId];
				io.to(user.room).emit('user:interaction:complete',{object:objectId});
			});
		}
	}
	client.on('interaction:start', userStartInteraction);
	client.on('interaction:stop', userStopInteraction);
};