var userSocket = function() {
  var _this = this
  this.user = null
  this.usersList = []

  this.mouse = {
    x:rand(100, window.innerWidth-100),
    y:rand(100,window.innerHeight-100)
  }

  this.bind()
  this.bindDOM()
  this.getUser()
  this.getAllUsers()
}

userSocket.prototype.getUser = function(callback) {
  socket.emit('user:get')
}

userSocket.prototype.getAllUsers = function() {
  socket.emit('users:get')
}

userSocket.prototype.bind = function(user) {
  var _this = this

  // GET CURRENT USER
  socket.on('user:get', function(data) {
    _this.user = data.user
  })

  // GET ALL USERS
  socket.on('users:get', function(users) {
    _this.usersList = users
  })

  // GET USER MOVEMENTS
  socket.on('user:moves', function(data) {
    var user = data.user
    if(user.id == _this.user.id) return;

    console.log(data);
  })
}

userSocket.prototype.bindDOM = function() {
  var _this = this

  // BIND MOUSE AND SEND POSITION
  document.addEventListener('mousemove', function(e) {
    if(!_this.user) return

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
}
