var model = require("../../config/db");
ObjectId = require('mongodb').ObjectID;
var InteractionSocket = require('../models/Interaction');

exports.init = function(io,client,user,users,interactions) {
	function userStartInteraction(objectId) {

		user.object3DId = objectId;
		if(typeof interactions[objectId] == 'undefined') {

			model.InteractionModel.get({_id:ObjectId(objectId)}, function(interaction) {
				interactions[objectId] = new InteractionSocket(objectId, interaction[0].people_required);
				interactions[objectId].userList.push(user.id);

				interactionIsComplete(objectId);
			});

		} else {
			interactions[objectId].userList.push(user.id);
			interactionIsComplete(objectId);
		}

		io.to(user.room).emit('user:interaction:start',{user:user.id,object:objectId});
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
				console.log(data);
				io.to(user.room).emit('user:interaction:complete',{object:objectId});

			});
		}
	}
	client.on('interaction:start', userStartInteraction);
	client.on('interaction:stop', userStopInteraction);
};