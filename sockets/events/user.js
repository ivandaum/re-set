var HelpRequest = require('../models/HelpRequest');

ObjectId = require('mongodb').ObjectID;
var model = require("../../config/db");


exports.init = function(io,client,user,users,help_requests) {

  client.on('users:get', getAllUsers);
  client.on('user:change:name', changeName);
  client.on('user:moves', updatePosition);
  client.on('user:get', getUser);
  client.on('room:join', joinRoom);
  client.on('user:disconnect:room', disconnectRoom);
  client.on('send:help_request', sendHelpRequest);
  client.on('get:help_request', getHelpRequest);
  client.on('get:room:participation', getRoomParticipation);
  client.on('send:interaction', sendInteraction);

  // When user join, resend new list of users
  io.sockets.emit('user:connected',user)

  function sendInteraction(type) {
      if(typeof type != 'undefined' && typeof user.room != 'undefined') {
        io.to(user.room).emit('send:interaction',{type:type,user:user});
      }
  }

  function getRoomParticipation(data) {
    model.UserModel.get({room_id:ObjectId(data.room)}, function(usersForRoom) {

      var tmpUsers = [];
      for(var w=0; w<usersForRoom.length;w++) {
        tmpUsers.push(usersForRoom[w]);
      }

      io.to(user.id).emit('room:complete',{users:tmpUsers});
    });
  }


  function joinRoom(room,userMouse) {
    client.join(room);

    user.room = room;
    users[user.id].room = room;
    user.mouse = userMouse;
    users[user.id].mouse = userMouse;

    var roomUsers = getRoomUsers(room);

    client.emit('room:joined',room); // Allow user to send movements

    for(var i=0; i<help_requests.length; i++) {
      if(help_requests[i].roomId == room) {
        help_requests.splice(i,1);
        io.to('map').emit('get:help_request',help_requests);
        io.to(user.room).emit('get:room:help_request',{state:false});
        break;
      }
    }

    io.to(room).emit('user:join:room',roomUsers);
  }

  function disconnectRoom(roomName) {
    client.leave(roomName);
    var mongoRoom = user.room;
    user.room = "";

    io.to(roomName).emit('user:disconnect:room',user.id);

    var help = null;
    for(var e=0; e<help_requests.length; e++) {
      help = help_requests[e];

      if(help.roomId == roomName && help.userId == user.id) {
        help_requests.splice(e,1);
        io.to('map').emit('get:help_request',help_requests);
        break;
      }
    }

    if(roomName == 'map') return true;

    model.RoomModel.get({_id:ObjectId(mongoRoom)}, function(room) {

      if(typeof room[0] == 'undefined') return;

      if(room[0].is_finish == true) return;

      // If no more user in room, clean it
      for(id in users) {
        if(users[id].room == mongoRoom) return true;
      }

      model.InteractionModel.setIncomplete({room_id:ObjectId(mongoRoom)});
    });
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

      if(help.roomId == roomId ) {
        // User already send help
        io.to(user.room).emit('get:room:help_request',{state:false});
        help_requests.splice(e,1);
        return false;
      }
    }

    help = new HelpRequest(roomId,userId);
    help_requests.push(help.get());

    io.to('map').emit('get:help_request',help_requests);
    io.to(user.room).emit('get:room:help_request',{state:true});
  }

  function getHelpRequest() {
    client.emit('get:help_request',help_requests)
  }

};
