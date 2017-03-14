exports.init = function(io,client,user,users) {

  // When user join, resend new list of users
  io.sockets.emit('user:connected',user)
  io.sockets.emit('users:get',users)

  function disconnect() {
      io.sockets.emit('user:disconnected',user.id)
  }

  function updatePosition(data) {
      io.sockets.emit('user:moves',data)
  }

  function sendUser() {
    var data = {
      user: user.get()
    }
    client.emit('user:get',data)
  }

  function sendAllUsers() {
    client.emit('users:get',users)
  }

  client.on('users:get', sendAllUsers)
  client.on('user:moves', updatePosition);
  client.on('user:get', sendUser);
  client.on('disconnect', disconnect);
};
