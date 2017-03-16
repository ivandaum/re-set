exports.init = function(io,client,user,users) {

  // When user join, resend new list of users
  io.sockets.emit('user:connected',user)
  io.sockets.emit('users:get',users)

  function updatePosition(data) {
    if(user.room) {
      io.to(user.room).emit('user:moves',data);
    }
  }

  function getUser() {
    var data = {
      user: user.get()
    }
    client.emit('user:get',data)
  }

  function getAllUsers() {
    client.emit('users:get',users)
  }

  function changeName(data) {
      user.name = data.name
      users[user.id] = user
      getUser()
  }

  client.on('users:get', getAllUsers)
  client.on('user:change:name', changeName)
  client.on('user:moves', updatePosition);
  client.on('user:get', getUser);
};
