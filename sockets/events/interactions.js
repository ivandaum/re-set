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
					return false;
				}

				// In case of lag or something else, we re-test if interactions exist
				if(typeof interactions[objectId] == 'undefined') {
					interactions[objectId] = new InteractionSocket(objectId, interaction[0]);
				}

				interactions[objectId].users.push(user.id);
				io.to(user.room).emit('user:interaction:start',{user:user.id,object:objectId});

				isInteractionComplete(objectId);
			});

			return true;
		}


		if(interactions[objectId].users.indexOf(user.id) == -1) {
			interactions[objectId].users.push(user.id);
		}

		io.to(user.room).emit('user:interaction:start',{user:user.id,object:objectId});

		isInteractionComplete(objectId);
	}

	function userStopInteraction() {


		var object = user.object3DId;

		if(interactions[object]) {
			// Looking for user and removing it from user on this interaction
			for(var i=0; i<interactions[object].users.length; i++) {
				if(interactions[object].users[i] == user.id) {
					interactions[object].users.splice(i,1);
					break;
				}
			}
		}

		io.to(user.room).emit('user:interaction:stop',{user:user.id,object:object});
		user.object3DId = null;
	}


	function isInteractionComplete(id) {

		// NOT ENOUGHT USERS ON INTERACTION
		if(interactions[id].users.length < interactions[id].people_required) {
			client.emit('user:interaction:people_required',{
				people_clicking:interactions[id].users.length,
				people_required:interactions[id].people_required
			});
			return false;
		}


		model.InteractionModel.setComplete(ObjectId(id), function() {
			io.to(user.room).emit('user:interaction:complete',{object:id});
			// delete interactions[id];

			if(true || interactions[id].canUpdateRoom) {
				interactions[id].canUpdateRoom = false;
				isRoomComplete(interactions[id].room_id);
			}
		});
	}

	function isRoomComplete(id) {

		model.InteractionModel.get({room_id: ObjectId(id)}, function(inters) {
			for(var e=0; e<inters.length; e++) {
				if(!inters[e].is_finish) {
					return false;
				}
			}

			model.RoomModel.setComplete(ObjectId(id));

			var tmpUsers = [];
			for(var k in users) {

				if(users[k].room != id) continue;

				tmpUsers.push(users[k]);

				if(users[k].name == model.DEFAULT_NICKNAME) {
					io.to(users[k].id).emit('user:need-new-username');
					continue;
				}


				var date = new Date();
				model.UserModel.add({
					name:users[k].name,
					socket_id:users[k].id,
					room_id:ObjectId(id),
					created_at: date.toString()
				});
			}

			// sending result to all players with usernames
			for(var z=0; z<tmpUsers.length; z++) {
				if(tmpUsers[z].name != model.DEFAULT_NICKNAME) {
					io.to(tmpUsers[z].id).emit('room:complete',{users:tmpUsers});
				}
			}

		});
	}

	function userAddContribution() {
		var room = user.room;

		if(!room) return;

		var date = new Date();

		model.UserModel.add({
			name:user.name,
			socket_id:user.id,
			room_id:ObjectId(room),
			created_at: date.toString()
		},function() {
			model.UserModel.get({room_id:ObjectId(room)}, function(usersForRoom) {

				var tmpUsers = [];
				for(var w=0; w<usersForRoom.length;w++) {
					tmpUsers.push(usersForRoom[w]);
				}

				io.to(user.id).emit('room:complete',{users:tmpUsers});
			});
		});


	}

	client.on('interaction:start', userStartInteraction);
	client.on('interaction:stop', userStopInteraction);
	client.on('user:add:contribution', userAddContribution);
};
