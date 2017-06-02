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

	/* --------- FUNCTION FOR SOCKET --------- */

	userNeedUsername() {
		document.querySelector('#username-box').style.display = 'block';
	}

	addContribution() {
		document.querySelector('#username-box').style.display = 'none';
		socket.emit('user:add:contribution');
	}

	userGet(data) {
		USER.user = data.user
	}

	usersGet(users) {
		USER.usersList = users
	}

	userMoves(data) {
		var user = data.user;
		if (APP.ThreeEntity.users.length > 0) {
			for (var i = 0; i < APP.ThreeEntity.users.length; i++) {
				if (user.id == APP.ThreeEntity.users[i].id) {
					APP.ThreeEntity.users[i].mouse = data.mouse
					break;
				}
			}
		}
	}

	roomJoined(room) {
		// Don't allow pushing position when user's on the map
		if (room != 'map') {
			USER.sendMouseMovement = true
	}

	}

	roomComplete(data) {

		if(document.querySelector('#username-box').style.display == 'block') {
			document.querySelector('#username-box').style.display == 'none';
		}

		new FlashMessage('Room complete!',2);

		for(var a=0; a<data.users.length; a++) {
			new FlashMessage(data.users[a].name,20);
		}

	}

	userEnterRoom(users) {
		USER.canSendHelp = true;

		if(notNull(APP.ThreeEntity)) {
			APP.ThreeEntity.users = users;
		}
	}

	userLeaveRoom(id) {
		if(USER.room == "map") return false;
		if (!notNull(APP.ThreeEntity.removeUsersArray[id])) {
			APP.ThreeEntity.removeUsersArray[id] = true
		}
	}

	tooMuchHelpRequest() {
		// TODO : SHOW ALERT OR ANIMATE BUTTON
		new FlashMessage('You already asked for help in this room.',3);
	}

	getHelpRequest(help) {
		if(USER.room == "map") {
			APP.ThreeEntity.helpRequests = help;
		}
	}

	userStartInteraction(data) {
		return;

		// TODO : ANIMATE
		if(data.user != USER.user.id) {
			console.log('user ' + data.user + ' start clicking');
		} else {
			console.log('You start clicking');
		}
	}

	userStopInteraction(data) {
		return;

		// TODO : ANIMATE IF USER STOP DOING THE INTERACTION
		if(data.user != USER.user.id) {
			console.log('user ' + data.user + ' stop clicking');
		} else {
			console.log('You stop clicking');
		}
	}

	interactionIsToHeavy(data) {

		if(data.user != USER.user.id) {
			var need = data.people_required - data.people_clicking;
			new FlashMessage('Too heavy, need ' + need + ' more person(s).',3);
		}
	}

	interactionIsComplete(data) {
		APP.ThreeEntity.setAccomplished(data.object);
		new FlashMessage('Interaction completed ! ' + data.object,3);
	}


	/* --------- FUNCTION FOR DOM BINDING --------- */

	mouseMove(e) {
		USER.mouse = USER.mouseToTHREE(e);
		if (!CAMERA) return;

		var data = {
			mouse: USER.mouse,
			user: USER.user
		};

		if(USER.room != "map" && notNull(APP.ThreeEntity)) {
			APP.ThreeEntity.movePlan(data);
		}

		if (USER.room == 'map') {
			APP.mapRaycaster(USER.mouse);
		}


		if (!USER.sendMouseMovement || USER.sendMouseMovement && !USER.room) return;

		socket.emit('user:moves', data)
	}

	mouseUp(e) {

		if(!CAMERA || !APP.ThreeEntity || USER.room == 'map' || isNull(USER.room)) return;

		APP.ThreeEntity.mouseDown = false;

		socket.emit("interaction:stop");
	}

	mouseDown(e) {
		if(APP.ThreeEntity) {
			APP.ThreeEntity.mouseDown = true;
		}

		if(!CAMERA || USER.room == 'map' || isNull(APP.ThreeEntity)) return;

		var object = APP.roomRaycaster(USER.mouseToTHREE(e));

		if(isNull(object)) return false;

		// TODO : set a generic method to progress tube
		var progress = {
			room:APP.ThreeEntity.uniforms.whitePath.value * 100,
			object:object.db.percent_progression
		};


		if(!object.db.is_finish) {
			socket.emit("interaction:start",object.db._id);

		} else if(object.db.is_finish) {
			new FlashMessage('Obstacle ' + object.mesh.name + ' already done.',2)

		}
		// else if(progress.room <= progress.object) {
		// 	new FlashMessage('You must finish previous obstacles.',2)
		// }

	}

	mouseClick(e) {

		if(!CAMERA || USER.room != "map" && USER.room) return;

		var roomId = APP.ThreeEntity.hoverRoom;

		if (USER.room == 'map' && notNull(roomId)) {

			USER.leave(function () {
				USER.enter(roomId);
			});

		}
	}

	bind() {
		var _this = this;

		// GET CURRENT USER
		socket.on('user:get', this.userGet);

		// GET ALL USERS
		socket.on('users:get', this.usersGet);

		// GET USER MOVEMENTS
		socket.on('user:moves', this.userMoves);

		// ON SUCCESSFULL AUTHENTICATE IN ROOM
		socket.on('room:joined', this.roomJoined);

		// ON COMPLETE ROOM
		socket.on('room:complete', this.roomComplete);

		// WHEN USER REACH A ROOM
		socket.on('user:join:room', this.userEnterRoom);

		// IF USER DISCONNECT
		socket.on('user:disconnect:room', this.userLeaveRoom);

		// GET HELP REQUESTS
		socket.on('get:help_request', this.getHelpRequest);

		// IF USER ALREADY SEND HELP REQUEST
		socket.on('too_much:help_request', this.tooMuchHelpRequest);

		// WHEN USER MOVES INTERACTIONS
		socket.on('user:interaction:start', this.userStartInteraction);

		// WHEN USER STOP MOVING INTERACTIONS
		socket.on('user:interaction:stop', this.userStopInteraction);

		socket.on('user:need-new-username', this.userNeedUsername);

		// INTERACTION IS TO HEAVY
		socket.on('user:interaction:people_required', this.interactionIsToHeavy);

		// Interaction is finished
		socket.on('user:interaction:complete', this.interactionIsComplete);


		// ---------- DOM -----------


		// BIND MOUSE AND SEND POSITION
		document.addEventListener('mousemove', this.mouseMove);

		// WHEN USER STOP CLICKING
 	    document.addEventListener('mouseup', this.mouseUp);

		// USER START CLICKING
		document.addEventListener('mousedown', this.mouseDown);

		// USER CLASSIC CLICK
		document.addEventListener('click', this.mouseClick);
	}

	mouseToTHREE(e) {

		if(!CAMERA) return false;

		var mouse = {
			x: ( e.clientX / window.innerWidth ) * 2 - 1,
			y:-( e.clientY / window.innerHeight ) * 2 + 1
		};

		var vector = new THREE.Vector3(mouse.x, mouse.y, 10);
		vector.unproject( CAMERA );
		var dir = vector.sub( CAMERA.position ).normalize();
		var distance = - CAMERA.position.z / dir.z;

		return CAMERA.position.clone().add( dir.multiplyScalar( distance ) );
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

		ROOM = null;
		CAMERA = null;

		// var toDelete = [];

		for( var i = SCENE.children.length - 1; i >= 0; i--) {
			SCENE.remove(SCENE.children[i]);
		}


		this.room = null;
		this.sendMouseMovement = false;
		this.canSendHelp = true;

		if (isFunction(callback)) {
			callback()
		}
	}
}
