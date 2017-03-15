var users = {}

var UserModel = require('./models/User')
var user = require('./user')
var room = require('./room')

module.exports = function(io) {
  io.sockets.on('connection', function (client) {
      var newUser = new UserModel(client)
      users[newUser.id] = newUser.get()
      user.init(io,client, newUser,users)
      room.init(io,client, newUser,users)
  })

};
