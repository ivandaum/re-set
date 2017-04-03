var mongojs = require('mongojs');
var db = mongojs("re_set",["rooms","users","interactions"]);

db.on('ready',function() {
	console.log('database connected');
}).on('error', function(err) {
	console.log(err);
})
var RoomModel = require('../app/models/Room')

var config = {
	db:db,
	RoomModel: new RoomModel(db)
};

module.exports = config;