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
app.set('port', port)

const server = http.createServer(app)
server.listen(port, function() {})

var mongojs = require('mongojs');
var db = mongojs("re_set",["rooms","users","interactions"]);

var RoomModel = require('./app/models/Room')
var InteractionModel = require('./app/models/Interaction')
var roomModel = new RoomModel(db)
var interactionModel = new InteractionModel(db);

var roomsNumber = rand(2,10);
var success = 0;
var isFinish = false;
var roomFinish = false;
db.rooms.remove({});
db.interactions.remove({});

for(var i = 0; i<roomsNumber; i++) {
	roomModel.add({
		city_id:1,
		is_finish: false,
		object: 1 //rand(1,5)
	},function() {
		success++
		if(success == roomsNumber && !roomFinish) {
			console.log(success + ' rooms created.')
			roomFinish = true;

			console.log('creating interactions...\n')
			roomModel.get({},function(rooms) {
				console.log(rooms.length);
				if(rooms.length > 0) {
					for(var a=0; a<rooms.length; a++) {
						var number = a+1
						var interactionsNumber = rand(1,2);
						console.log('-- creating interactions (room ' + number + ' / ' + rooms.length + ')');
						console.log('---- ' + interactionsNumber + ' interactions added\n');
						for(var e=0; e<interactionsNumber; e++) {
							interactionModel.add({
								type:rand(1,2),
								is_finish: rand(0,1) == 1 ? true : false,
								room_id: rooms[a]._id,
								people_required: rand(1,5)
							},function() {
								if(a == rooms.length && !isFinish) {
									console.log('seed imported. You can know close the script.');
									isFinish = true;
								}
							})
						}

					}
				}
			});

		}
	})
}
