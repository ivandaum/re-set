var userSocket = function() {
  var _this = this
  this.user = null
  this.mouse = {
    x:rand(100, window.innerWidth-100),
    y:rand(100,window.innerHeight-100)
  }

  socket.on('user:connected', function(user) {
    _this.init(user, function() {
      console.log('connected')
    })
  })

}
userSocket.prototype.init = function(user,callback) {
  var _this = this
  socket.on('user:get', function(user) {
    _this.user = user
  })

  socket.on('user:moves', function(data) {
    var user = data.user
    if(user.id == _this.user.id) return;

    console.log('user ' + data.user.name + ' moving to ', data.mouse);
  })
  // BIND MOUSE AND SEND POSITION
  document.addEventListener('mousemove', function(e) {
    _this.mouse = {
      x:e.clientX,
      y:e.clientY
    }
    var data = {
      mouse:_this.mouse,
      user:_this.user
    }
    socket.emit('user:moves',data)
  })

  callback()
}
