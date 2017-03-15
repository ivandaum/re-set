var userSocket = function() {
  this.user = null
  this.usersList = []
  this.sendMouseMovement = false
  this.room = null

  this.color = {
    r:rand(30,255),
    g:rand(30,255),
    b:rand(30,255)
  }

  this.mouse = {
    x:rand(100, window.innerWidth-100),
    y:rand(100,window.innerHeight-100)
  }

  // bind new player

  this.bind()
  this.bindDOM()

  socket.emit('user:get')
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

  // ON SUCCESSFULL AUTHENTICATE IN ROOM
  socket.on('room:joined', function(roomName) {
      console.log('You join room "' + roomName + '"');
      _this.user.sendMouseMovement = true
  })

  // WHEN USER REACH A ROOM
  socket.on('user:join:room', function(user) {
      console.log('new user in room!',user.length);
  })
}

userSocket.prototype.joinRoom = function(roomName) {
  this.room = new Room(roomName)
  socket.emit('room:join',roomName)
}

userSocket.prototype.bindDOM = function() {
  var _this = this

  // BIND MOUSE AND SEND POSITION
  document.addEventListener('mousemove', function(e) {
    if(!_this.user) return
    if(!_this.sendMouseMovement || !_this.room) return

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
