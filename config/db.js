var mongojs = require('mongojs');
var db = mongojs("re_set",["rooms","users","interactions"]);

var RoomModel = require('../app/models/Room')
var UserModel = require('../app/models/User')
var InteractionModel = require('../app/models/Interaction')

var config = {
	db:db,
	RoomModel: new RoomModel(db),
	UserModel: new UserModel(db),
	InteractionModel: new InteractionModel(db)
};

module.exports = config;
