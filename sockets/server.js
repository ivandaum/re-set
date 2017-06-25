var users = {};
var help_requests = [];
var interactions = [];
var vectors = [];
var UserModel = require('./models/User');
var userEvent = require('./events/user');
var interactionsEvent = require('./events/interactions');
var model = require("../config/db");

module.exports = function(io) {
  io.sockets.on('connection', function (client) {
      var currentUser = new UserModel(client);
      users[currentUser.id] = currentUser.get();
      userEvent.init(io,client, currentUser,users,help_requests,vectors);
      interactionsEvent.init(io,client, currentUser,users,interactions,vectors);


    client.on('disconnect', function(){
      var userId = currentUser.get().id;

      if(currentUser.hasRoom()) {
        io.to(currentUser.room).emit('user:disconnect:room',userId);
      } else {
        io.sockets.emit('user:disconnected',userId)
      }

      var roomId = currentUser.get().room;

      if(!roomId || roomId == 'map') return;

        model.RoomModel.get({_id:ObjectId(roomId)}, function(room) {

            if(typeof room[0] == 'undefined') return;

            if(room[0].is_finish == true) return;

            // If no more user in room, clean it
            for(id in users) {
                if(users[id].room == roomId) return true;
            }

            model.InteractionModel.setIncomplete({room_id:ObjectId(roomId)});
        });

      delete users[userId]
    });
  })

};
