var model = require("../../config/db");
ObjectId = require('mongodb').ObjectID;
var InteractionSocket = require('../models/Interaction');

exports.init = function(io,client,user,users,interactions) {
	function userStartInteraction(objectId) {


		user.object3DId = objectId;

		if(typeof interactions[objectId] == 'undefined') {

			model.InteractionModel.get({_id:ObjectId(objectId)}, function(interaction) {

				// If already finish, we do not load it
				if(interaction[0].is_finish == true) {
					//return false;
				}

				interactions[objectId] = new InteractionSocket(objectId, interaction[0].people_required);
				interactions[objectId].userList.push(user.id);

				io.to(user.room).emit('user:interaction:start',{user:user.id,object:objectId});

				interactionIsComplete(objectId);
			});

		} else {
			io.to(user.room).emit('user:interaction:start',{user:user.id,object:objectId});


			var userAlreadyPresent = false;
			for(var e=0; e<interactions[objectId].userList.length; e++) {
				if(user.id == interactions[objectId].userList[e]) {
					userAlreadyPresent = true;
					break;
				}
			}

			if(!userAlreadyPresent) {
				interactions[objectId].userList.push(user.id);
			}

			interactionIsComplete(objectId);
		}
	}

	function userStopInteraction() {


		var object = user.object3DId;

		if(interactions[object]) {
			// Looking for user an removing it from user on this interaction
			for(var i=0; i<interactions[object].userList.length; i++) {

				if(interactions[object].userList[i] == user.id) {
					interactions[object].userList.splice(i,1);
					break;
				}
			}
		}

		io.to(user.room).emit('user:interaction:stop',{user:user.id,object:object});
		user.object3DId = null;
	}


	function interactionIsComplete(objectId) {

		if(interactions[objectId].userList.length >= interactions[objectId].people_required ) {

			model.InteractionModel.setComplete(ObjectId(objectId), function(data) {

				for(var a=0; a<interactions[objectId].userList.length; a++) {
					var cUser = interactions[objectId].userList[a];
					var newUser = {
						nickname:users[cUser].name,
						socket_id:users[cUser].id,
						interaction_id:objectId
					};
					model.UserModel.add(newUser);
				}

				io.to(user.room).emit('user:interaction:complete',{object:objectId});
				delete interactions[objectId];
			});
		} else {
			client.emit('user:interaction:people_required',{people_clicking:interactions[objectId].userList.length,people_required:interactions[objectId].people_required});
		}
	}
	client.on('interaction:start', userStartInteraction);
	client.on('interaction:stop', userStopInteraction);
};
