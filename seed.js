const APP_PATH = 'app'
const PUBLIC_PATH = 'public'
const express = require('express')
const http = require('http')
const path = require('path')
const app = express()
const port = process.env.PORT || '3000'

function rand(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ------- SERVER CONFIG
// app.set('port', port)
//
// const server = http.createServer(app)
// 	server.listen(port, function () {
// });

var mongojs = require('mongojs');
var db = mongojs("re_set", ["rooms", "users", "interactions"]);

var RoomModel = require('./app/models/Room')
var InteractionModel = require('./app/models/Interaction')

var Room = new RoomModel(db)
var Interaction = new InteractionModel(db);

var rooms = require("./migrations/rooms");

var migration = {};
db.rooms.remove({});
db.users.remove({});
db.interactions.remove({});

for (var i = 0; i < rooms.length; i++) {
	migration = rooms[i];

	if (typeof migration.is_finish == 'undefined') migration.is_finish = false;

	new Promise(function(resolve) {
		var migration = rooms[i];
		Room.add(migration, function (room) {
			var interaction = migration.interactions;
			resolve({room:room,interaction:interaction});
		});
	})
	.then(function(data) {
		var room = data.room;
		var interaction = data.interaction;

		if (!room) {
			console.log('Error while saving');
		}

		for (var a = 0; a < interaction.length; a++) {
			var inter = interaction[a];


			if (typeof inter.is_finish == 'undefined') inter.is_finish = false;
			inter.room_id = room._id;

			Interaction.add(inter, function (saved) {
				if (!saved) {
					console.log("Error while saving interactions");
				} else {
					console.log("Room " + room._id + " : interaction " + interaction.length);
				}
			});
		}
	});

}