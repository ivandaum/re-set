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
  } else {
    socket.emit('user:get');
  }
}

UserSocket.prototype = {
  changeName:function(name,callback) {
    socket.emit('user:change:name',{name:name})
    if(typeof callback == 'function') {
      callback();
    }
  },
  bind:function() {
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

      if(APP.RoomTHREE.users.length > 0) {
        for (var i = 0; i < APP.RoomTHREE.users.length; i++) {
          if(user.id == APP.RoomTHREE.users[i].id) {
            APP.RoomTHREE.users[i].mouse = data.mouse
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
      APP.RoomTHREE.users = users
    })

    // IF USER DISCONNECT
    socket.on('user:disconnect:room', function(userId) {
      if(typeof APP.RoomTHREE.removeUsersArray[userId] == 'undefined') {
        APP.RoomTHREE.removeUsersArray[userId] = true
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

      if(!_this.sendMouseMovement || !_this.room ) return

      var data = {
        mouse:_this.mouse,
        user:_this.user
      }

      socket.emit('user:moves',data)
    })

  },
  enter: function(room,callback) {

    if(room == "map") {
      APP = new MapController();
      APP.getMap();
    } else {
      APP = new RoomController(room);
    }

    this.room = room;
    socket.emit('room:join',this.room,this.mouse)

    if(typeof callback == 'function') {
      callback()
    }
  },
  leave: function(callback) {
    if(ROOM == null) return;

    socket.emit('user:disconnect:room',this.room,this.mouse)
    ROOM = null;
    CAMERA = null;

    this.room = '';
    this.sendMouseMovement = false;

    if(typeof callback == 'function') {
      callback()
    }
  }

}
