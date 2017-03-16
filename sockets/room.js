exports.init = function(io,client,user,users) {

  function joinRoom(roomName) {
    client.join(roomName)
    client.emit('room:joined',roomName)
    user.room = roomName

    var roomUsers = getRoomUsers(roomName)

    io.to(roomName).emit('user:join:room',roomUsers);
  }

  function getRoomUsers(roomName) {
    var usersRoom = []
    var room = getRoom(roomName)

    for(id in room.sockets) {
      usersRoom.push(users[id])
    }

    return usersRoom
  }

  function getRoom(roomName) {
    return io.sockets.adapter.rooms[roomName];
  }

  client.on('room:join', joinRoom)
};
