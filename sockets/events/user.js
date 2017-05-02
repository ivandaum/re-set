var HelpRequest = require('../models/HelpRequest');

exports.init = function(io,client,user,users,help_requests) {

  // When user join, resend new list of users
  io.sockets.emit('user:connected',user)

  function joinRoom(room,userMouse) {
    client.join(room)
    client.emit('room:joined',room)
    user.room = room
    user.mouse = userMouse
    var roomUsers = getRoomUsers(room)

    for(var i=0; i<help_requests.length; i++) {
        if(help_requests[i].roomId == room) {
          help_requests.splice(i,1);
          io.to('map').emit('get:help_request',help_requests);
          break;
        }
    }

    io.to(room).emit('user:join:room',roomUsers);
  }

  function disconnectRoom(roomName, userMouse) {
    client.leave(roomName);
    user.room = "";
    user.mouse = userMouse;
    io.to(roomName).emit('user:disconnect:room',user.id);

    var help = null;
    for(var e=0; e<help_requests.length; e++) {
      help = help_requests[e];

      if(help.roomId == roomName && help.userId == user.id) {
        help_requests.splice(e,1);
        io.to('map').emit('get:help_request',help_requests);
        return true;
      }

    }
  }

  function getRoomUsers(roomName) {
    var usersRoom = []
    var room = getRoom(roomName)

    for(id in room.sockets) {
      usersRoom.push(users[id]);
    }

    return usersRoom
  }

  function getRoom(roomName) {
    return io.sockets.adapter.rooms[roomName];
  }

  function updatePosition(data) {
    if(user.room) {
      user.mouse = data.mouse
      users[user.id].mouse = data.mouse
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

      if(data.name.length > 10) {
          data.name = data.name.substr(0,10);
          data.name += "..."
      }

      user.name = data.name;
      users[user.id] = user;
      getUser()
  }

  function sendHelpRequest() {

    var userId = user.id;
    var roomId = user.room;
    var help = null;
    for(var e=0; e<help_requests.length; e++) {
      help = help_requests[e];

      if(help.roomId == roomId && help.userId == userId) {
        // User already send help
        client.emit('too_much:help_request');
        return false;
      }

    }
    help = new HelpRequest(roomId,userId);
    help_requests.push(help.get());
    io.to('map').emit('get:help_request',help_requests);
  }


  function getHelpRequest() {
    client.emit('get:help_request',help_requests)
  }


  client.on('users:get', getAllUsers);
  client.on('user:change:name', changeName);
  client.on('user:moves', updatePosition);
  client.on('user:get', getUser);
  client.on('room:join', joinRoom);
  client.on('user:disconnect:room', disconnectRoom);
  client.on('send:help_request', sendHelpRequest);
  client.on('get:help_request', getHelpRequest);
};
