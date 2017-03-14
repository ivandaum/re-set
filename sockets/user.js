exports.init = function(io,client,user) {

  function disconnect() {
      io.sockets.emit('user:disconnected',user.id)
  }
  function connected(user) {
      io.sockets.emit('user:connected',user)
      client.emit('user:get',user)
  }
  function updatePosition(data) {
      io.sockets.emit('user:moves',data)
  }

  connected(user)
  client.on('disconnect', disconnect);
  client.on('user:moves', updatePosition);
};
