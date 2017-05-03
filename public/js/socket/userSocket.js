class UserSocket {
	constructor(name) {
		this.user = null;
		this.sendMouseMovement = false;
		this.room = null;
		this.mouse = new THREE.Vector3(0, 0, 0);
		this.canSendHelp = true;

		this.bind();
		if (name) {
			socket.emit('user:change:name', {name: name})
		} else {
			socket.emit('user:get');
		}
	}

	changeName(name, callback) {
		socket.emit('user:change:name', {name: name})
		if (typeof callback == 'function') {
			callback();
		}
	}

	bind() {
		var _this = this

		// GET CURRENT USER
		socket.on('user:get', function (data) {
			_this.user = data.user
		})

		// GET ALL USERS
		socket.on('users:get', function (users) {
			_this.usersList = users
		})

		// GET USER MOVEMENTS
		socket.on('user:moves', function (data) {
			var user = data.user
			if (APP.RoomTHREE.users.length > 0) {
				for (var i = 0; i < APP.RoomTHREE.users.length; i++) {
					if (user.id == APP.RoomTHREE.users[i].id) {
						APP.RoomTHREE.users[i].mouse = data.mouse
						break;
					}
				}
			}
		});

		// ON SUCCESSFULL AUTHENTICATE IN ROOM
		socket.on('room:joined', function (roomName) {
			// Don't allow pushing position when user's on the map
			if (roomName != 'map') {
				_this.sendMouseMovement = true
			}
		});

		// WHEN USER REACH A ROOM
		socket.on('user:join:room', function (users) {
			_this.canSendHelp = true;
			APP.RoomTHREE.users = users
		});

		// IF USER DISCONNECT
		socket.on('user:disconnect:room', function (userId) {
			if(_this.room == "map") return false;
			if (typeof APP.RoomTHREE.removeUsersArray[userId] == 'undefined') {
				APP.RoomTHREE.removeUsersArray[userId] = true
			}
		});

		// GET HELP REQUESTS
		socket.on('get:help_request', function (help_requests) {
			if(_this.room == "map") {
				console.log('number',help_requests);
				APP.RoomTHREE.helpRequests = help_requests;
			}
		});

		socket.on('too_much:help_request', function() {
			console.log('You already ask for help in this room!')
		});

		// ---------- DOM -----------
		// BIND MOUSE AND SEND POSITION
		document.addEventListener('mousemove', function (e) {
			if (!CAMERA) return

			var mouse = {
				x: ( e.clientX / window.innerWidth ) * 2 - 1,
				y: -( e.clientY / window.innerHeight ) * 2 + 1
			}

			var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
			vector.unproject(CAMERA);
			var dir = vector.sub(CAMERA.position).normalize();
			var distance = -CAMERA.position.z / dir.z;
			_this.mouse = CAMERA.position.clone().add(dir.multiplyScalar(distance));

			var data = {
				mouse: _this.mouse,
				user: _this.user
			};

            // TODO: improve condidtions
            if(_this.room != "map") {
   	            APP.RoomTHREE.movePlan(data);
            }

			if (_this.room == 'map') {
				APP.mapRaycaster(_this.mouse);
			}

			if (!_this.sendMouseMovement || !_this.room) return

			socket.emit('user:moves', data)
		});

        document.addEventListener('mousedown', function(e) {
	        if(APP.RoomTHREE) {
		        APP.RoomTHREE.mouseDown = true;
	        }
        });

 	    document.addEventListener('mouseup', function(e) {
	        if(APP.RoomTHREE) {
		        APP.RoomTHREE.mouseDown = false;
	        }
        });

		document.addEventListener('click', function (e) {

            if(!CAMERA) return;

     		var mouse = {
              x: ( e.clientX / window.innerWidth ) * 2 - 1,
              y:- ( e.clientY / window.innerHeight ) * 2 + 1
            };

            var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
            vector.unproject( CAMERA );
            var dir = vector.sub( CAMERA.position ).normalize();
            var distance = - CAMERA.position.z / dir.z;
            var mouse2 = CAMERA.position.clone().add( dir.multiplyScalar( distance ) );

           if(_this.room != "map" && _this.room) {
     		  APP.roomRaycaster(mouse2);
     		  return;
     	  }

			var roomId = APP.RoomTHREE.hoverRoom;

			if (USER.room == 'map' && typeof roomId != 'undefined' && roomId != null) {
				USER.leave(function () {
					USER.enter(roomId);
				});

			}
		});
	}

	enter(room, callback) {

		if (room == "map") {
			APP = new MapController();
			APP.getMap();
		} else {
			APP = new RoomController(room);
			Navigator.setUrl('/room/' + room);
			Navigator.roomPanel.show();
		}
		this.room = room;
		socket.emit('room:join', this.room, this.mouse)

		if (typeof callback == 'function') {
			callback()
		}
	}

	leave(callback) {
		socket.emit('user:disconnect:room', this.room, this.mouse);

		Navigator.setUrl('/');
		Navigator.roomPanel.hide();

		ROOM = null;
		CAMERA = null;

		SCENE = null;
		this.room = null;
		this.sendMouseMovement = false;
		this.canSendHelp = true;
		if (typeof callback == 'function') {
			callback()
		}
	}
}
