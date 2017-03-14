var UserModel = require('./models/User')
var user = require('./user')

module.exports = function(io) {
  var users = []
  io.sockets.on('connection', function (client) {

      // add user and init it
      var newUser = new UserModel(client)
      users[newUser.id] = newUser
      user.init(io,client, newUser)
  })
};
