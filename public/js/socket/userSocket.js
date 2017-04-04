var UserSocket = function(name) {
  this.user = null
  this.usersList = []
  this.sendMouseMovement = false
  this.room = null
  this.mouse = new THREE.Vector3(0,0,0)
  this.firstConnection = true
  this.bind()
  if(name) {
    socket.emit('user:change:name',{name:name})
  }
}

UserSocket.prototype = {
  changeName:function(name) {
    socket.emit('user:change:name',{name:name})
  },
  bind:function() {
    var _this = this

    // GET CURRENT USER
    socket.on('user:get', function(data) {
      _this.user = data.user
      if(_this.firstConnection) {
        _this.firstConnection = false;

        // ON FIRST CONNECTION, WE LOAD THE map
        var map = new MapApp();
        map.getMap();
      }
    })

    // GET ALL USERS
    socket.on('users:get', function(users) {
      _this.usersList = users
    })

    // GET USER MOVEMENTS
    socket.on('user:moves', function(data) {
      var user = data.user
      if(_this.room.users.length > 0) {
        for (var i = 0; i < _this.room.users.length; i++) {
          if(user.id == _this.room.users[i].id) {
            _this.room.users[i].mouse = data.mouse
            break;
          }
        }
      }
    })

    // ON SUCCESSFULL AUTHENTICATE IN ROOM
    socket.on('room:joined', function(roomName) {
        _this.sendMouseMovement = true
    })

    // WHEN USER REACH A ROOM
    socket.on('user:join:room', function(users) {
      _this.room.users = users
    })

    // IF USER DISCONNECT
    socket.on('user:disconnect:room', function(userId) {
      if(typeof _this.room.removeUsersArray[userId] == 'undefined') {
        _this.room.removeUsersArray[userId] = true
      }
    })

    // ---------- DOM -----------
    // BIND MOUSE AND SEND POSITION
    document.addEventListener('mousemove', function(e) {
      if(!CAMERA) return

      var mouse = {
        x: ( e.clientX / window.innerWidth ) * 2 - 1,
        y:- ( e.clientY / window.innerHeight ) * 2 + 1
      }

      var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
      vector.unproject( CAMERA );
      var dir = vector.sub( CAMERA.position ).normalize();
      var distance = - CAMERA.position.z / dir.z;
      _this.mouse = CAMERA.position.clone().add( dir.multiplyScalar( distance ) );

      if(!_this.user) return
      if(!_this.sendMouseMovement || !_this.room) return

      var data = {
        mouse:_this.mouse,
        user:_this.user
      }

      socket.emit('user:moves',data)
    })

  },
  joinRoom: function(roomName) {
    this.room = new Room(roomName)
    socket.emit('room:join',roomName,this.mouse)

  }

}
