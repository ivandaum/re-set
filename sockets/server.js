var users = {}

var UserModel = require('./models/User')
var userEvent = require('./events/user')

module.exports = function(io) {
  io.sockets.on('connection', function (client) {
      var currentUser = new UserModel(client)
      users[currentUser.id] = currentUser.get()
      userEvent.init(io,client, currentUser,users)

    client.on('disconnect', function(){
      var userId = currentUser.get().id;

      if(currentUser.hasRoom()) {
        io.to(currentUser.room).emit('user:disconnect:room',userId);
      } else {
        io.sockets.emit('user:disconnected',userId)
      }

      delete users[userId]
    });
  })

};
