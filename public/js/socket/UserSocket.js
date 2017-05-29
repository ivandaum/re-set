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
		});

		// GET ALL USERS
		socket.on('users:get', function (users) {
			_this.usersList = users
		});

		// GET USER MOVEMENTS
		socket.on('user:moves', function (data) {
			var user = data.user
			if (APP.ThreeEntity.users.length > 0) {
				for (var i = 0; i < APP.ThreeEntity.users.length; i++) {
					if (user.id == APP.ThreeEntity.users[i].id) {
						APP.ThreeEntity.users[i].mouse = data.mouse
						break;
					}
				}
			}
		});

		// ON SUCCESSFULL AUTHENTICATE IN ROOM
		socket.on('room:joined', function (roomName) {
			// Don't allow pushing position when user's on the map
			if (roomName != 'map') {
				// console.info('%cUser can send movement','color:red;');
				_this.sendMouseMovement = true
			}
		});

		// WHEN USER REACH A ROOM
		socket.on('user:join:room', function (users) {
			_this.canSendHelp = true;

			if(notNull(APP.ThreeEntity)) {
				APP.ThreeEntity.users = users;
			}
		});

		// IF USER DISCONNECT
		socket.on('user:disconnect:room', function (userId) {
			if(_this.room == "map") return false;
			if (!notNull(APP.ThreeEntity.removeUsersArray[userId])) {
				APP.ThreeEntity.removeUsersArray[userId] = true
			}
		});

		// GET HELP REQUESTS
		socket.on('get:help_request', function (help_requests) {
			if(_this.room == "map") {
				APP.ThreeEntity.helpRequests = help_requests;
			}
		});

		socket.on('too_much:help_request', function() {

			// TODO : SHOW ALERT OR ANIMATE BUTTON

			console.log('You already ask for help in this room!')
		});


		// WHEN USER MOVES INTERACTIONS

		socket.on('user:interaction:start', function(data){

			// TODO : ANIMATE
			return;

			if(data.user != _this.user.id) {
				console.log('user ' + data.user + ' start clicking');
			} else {
				console.log('You start clicking');
			}
		});

		socket.on('user:interaction:people_required', function(data){

			// TODO : SHOW MANY PEOPLE ARE REQUIRED

			if(data.user != _this.user.id) {
				var need = data.people_required - data.people_clicking;
				new FlashMessage('Too heavy, need ' + need + ' more person(s).',3);

				console.log('Too heavy, need ' + data.people_required + ' people');
			}
		});

		socket.on('user:interaction:stop', function(data){

			// TODO : ANIMATE IF USER STOP DOING THE INTERACTION
			return;

			if(data.user != _this.user.id) {
				console.log('user ' + data.user + ' stop clicking');
			} else {
				console.log('You stop clicking');
			}
		});

		socket.on('user:interaction:complete', function(data) {

			APP.ThreeEntity.setAccomplished(data.object);
			console.log("Interaction completed ! " + data.object);
		});

		// ---------- DOM -----------
		// BIND MOUSE AND SEND POSITION
		document.addEventListener('mousemove', function (e) {
			_this.mouse = _this.mouseToTHREE(e);
			if (!CAMERA) return;

			var data = {
				mouse: _this.mouse,
				user: _this.user
			};


      // TODO: improve condidtions
      if(_this.room != "map" && notNull(APP.ThreeEntity)) {
            APP.ThreeEntity.movePlan(data);
      }

			if (_this.room == 'map') {
				APP.mapRaycaster(_this.mouse);
			}

			if (!_this.sendMouseMovement || !_this.room) return;

			socket.emit('user:moves', data)
		});


 	    document.addEventListener('mouseup', function(e) {
	        if(APP.ThreeEntity && _this.room != 'map') {
		        APP.ThreeEntity.mouseDown = false;

		        if(!CAMERA) return;

		        socket.emit("interaction:stop");
	        }

        });

		document.addEventListener('mousedown', function(e) {
			if(APP.ThreeEntity) {
				APP.ThreeEntity.mouseDown = true;
			}

			if(!CAMERA || _this.room == 'map' || isNull(APP.ThreeEntity)) return;

			var object = APP.roomRaycaster(_this.mouseToTHREE(e));

			if(isNull(object)) return false;

			// TODO : set a generic method to progress tube
			var progress = {
				room:APP.ThreeEntity.uniforms.whitePath.value * 100,
				object:object.db.percent_progression
			};

			if(!object.db.is_finish && progress.room >= progress.object) {

				socket.emit("interaction:start",object.db._id);

			} else if(object.db.is_finish) {

				new FlashMessage('Obstacle ' + object.mesh.name + ' already done.',2)

			} else if(progress.room <= progress.object) {

				new FlashMessage('You must finish previous obstacles.',2)
			}

		});

		document.addEventListener('click', function (e) {

			if(!CAMERA) return;

			if(_this.room != "map" && _this.room) {
     		  return;
     	  }

			var roomId = APP.ThreeEntity.hoverRoom;
			var mouse = _this.mouseToTHREE(e);

			if (_this.room == 'map' && notNull(roomId)) {
				USER.leave(function () {

					USER.enter(roomId);
				});

			}
		});
	}

	mouseToTHREE(e) {

		if(!CAMERA) return false;

		var mouse = {
			x: ( e.clientX / window.innerWidth ) * 2 - 1,
			y:-( e.clientY / window.innerHeight ) * 2 + 1
		};

		var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
		vector.unproject( CAMERA );
		var dir = vector.sub( CAMERA.position ).normalize();
		var distance = - CAMERA.position.z / dir.z;

		return CAMERA.position.clone().add( dir.multiplyScalar( distance ) );
	}

	sendUserPosition(e) {
		if (!CAMERA || !notNull(e)) return;

		this.mouse = this.mouseToTHREE(e);

		var data = {
			mouse: this.mouse,
			user: this.user
		};

		socket.emit('user:moves', data)
	}

	enter(room, callback) {
		var _this = this;

		this.room = room;
		if (room == "map") {
			APP = new MapController();
			APP.getMap();
		} else {
			APP = new RoomController(room,function() {
				Navigator.setUrl('/room/' + room);
				Navigator.roomPanel.show();
				socket.emit('room:join', _this.room, _this.mouse);
			});
		}

		if (isFunction(callback)) {
			callback()
		}
	}

	leave(callback) {
		socket.emit('user:disconnect:room', this.room);

		Navigator.setUrl('/');
		Navigator.roomPanel.hide();

		ROOM = null;
		CAMERA = null;

		SCENE = null;
		this.room = null;
		this.sendMouseMovement = false;
		this.canSendHelp = true;

		if (isFunction(callback)) {
			callback()
		}
	}
}
