class UserSocket {
	constructor(name) {
		this.user = null;
		this.sendMouseMovement = false;
		this.room = null;
		this.mouse = new THREE.Vector3(0, 0, 0);
		this.canSendHelp = true;
		this.clickOn = null;
		this.canMouveCamera = true;

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
		addClass(document.querySelector('#result-box'),'active');

		if(hasClass(document.querySelector('#result-box .form'),'disable')) {
			removeClass(document.querySelector('#result-box .form'),'disable');
		}
	}

	addContribution() {
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

					APP.ThreeEntity.users[i].mouse = data.mouse;
					break;
				}
			}
		}

		// get vector user data
		if(notNull(APP.ThreeEntity)) {
			if(APP.ThreeEntity.usersVectors.length > 0) {
				for (var i = 0; i < APP.ThreeEntity.usersVectors.length; i++) {
					if (APP.ThreeEntity.usersVectors[i].user.id == user.id) {
						APP.ThreeEntity.usersVectors[i].oldVectorEnd = APP.ThreeEntity.usersVectors[i].vectorEnd;
						APP.ThreeEntity.usersVectors[i].vectorEnd = data.mouse;
						break;
					}
				}
			}
		}

	}

	roomJoined(room) {
		// Don't allow pushing position when user's on the map
		if (room != 'map' && room != 'home') {
			USER.sendMouseMovement = true
		}

	}

	roomComplete(data) {
		if(!hasClass(document.querySelector('#result-box .form'),'disable')) {
			addClass(document.querySelector('#result-box .form'),'disable');
		}

		if(!hasClass(document.querySelector('#result-box','active'))) {
			addClass(document.querySelector('#result-box'),'active');
		}

		var avatarsPosition = [
			{right:80,top:50},
			{left:-10,top:230},
			{left:260,top:-10},
			{right:370,top:530},
			{right:-10,top:230},
			{right:170,top:530},
			{right:20,top:400},
			{left:30,top:400},
			{left:80,top:50},
		];

		var users = data.users;
		for(var a=0; a<users.length; a++) {
			var bloc = document.createElement('div');
			var userName = document.createElement('span');
			userName.innerHTML = users[a].name;
			bloc.className = 'user';
			bloc.appendChild(userName);

			document.querySelector('.users-result').appendChild(bloc);

			for(let attr in avatarsPosition[a]) {
				bloc.style[attr] = avatarsPosition[a][attr] + 'px';
			}


		}
	}

	onRoomFinish(room) {
    for (var i = 0; i < LOADER.db.rooms.length; i++) {
			if(room.id == LOADER.db.rooms[i]._id) {

				if(USER.room == "map") {
					APP.ThreeEntity.rooms[i].is_finish = true;
				}

				LOADER.db.rooms[i].is_finish = true;
			}
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
		if (!USER.room == 'map' && !USER.room == 'home') {
			console.log(APP.ThreeEntity);
		}
	}

	getRoomHelpRequest(help) {
		if(USER.room == 'map' && USER.room == 'home') return;

		if(help.state) {
				// Animer le bouton vers l'état actif
				APP.ThreeEntity.button.switchHelp(true);
				USER.canSendHelp = false;
			} else { // si c'est déjà a false et qu'on reçoit false, ne pas passer ici
				APP.ThreeEntity.button.switchHelp(false);
				USER.canSendHelp = true;
			}
	}

	userStartInteraction(data) {

		if (APP.ThreeEntity.usersVectors) {
			APP.ThreeEntity.addVectorsDraw(data.user.id);
			APP.ThreeEntity.usersVectors.push({
				user: data.user,
				vectorStart: data.mouseStart,
				vectorEnd: data.mouseStart,
				interactionClicked: data.objectId
			});
		}

	}

	userStopInteraction(data) {

		if (APP.ThreeEntity.usersVectors) {
			if(APP.ThreeEntity.usersVectors.length > 0) {
				for (var i = 0; i < APP.ThreeEntity.usersVectors.length; i++) {
					if (APP.ThreeEntity.usersVectors[i].user.id == data.user) {
						APP.ThreeEntity.usersVectors[i].stopClick = true;
						APP.ThreeEntity.removeVectorsDraw(data.user);
					}
				}
			}
		}
	}

	interactionIsToHeavy(data) {
		if(data.user != USER.user.id) {
			var need = data.people_required - data.people_clicking;
			new FlashMessage('Too heavy, need ' + need + ' more person(s).',3);
		}
	}

	usersFinishedInteraction(interaction_id) {
			socket.emit('interaction:mouvement:done',{interaction_id:interaction_id});
	}

	interactionIsComplete(data) {
		for (var i = 0; i < data.users.length; i++) {
			APP.ThreeEntity.removeVectorsDraw(data.users[i]);
			for (var j = 0; j < APP.ThreeEntity.usersVectors.length; j++) {
				if (data.users[i] == APP.ThreeEntity.usersVectors[i].user.id) {
					APP.ThreeEntity.usersVectors.splice(j, 1);
				}
			}
		}
		APP.ThreeEntity.setAccomplished(data.object);
		new FlashMessage('Interaction completed ! ' + data.object,3);
	}

	showInteractionPlayer(data) {
		APP.interactionsMessages.push(new InteractionMessage(data.type,data.user.id,data.user.mouse));
	}

	/* --------- FUNCTION FOR DOM BINDING --------- */

	mouseMove(e) {
		USER.mouse = USER.mouseToTHREE(e);
		if (!CAMERA) return;

		var data = {
			mouse: USER.mouse,
			user: USER.user
		};

		if(USER.room != 'map' && notNull(APP.ThreeEntity)) {
			//TODO : add home exception
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
		if(isNull(APP) || isNull(APP.ThreeEntity)) return;


		APP.ThreeEntity.mouseDown = true;

		if(!CAMERA || isNull(USER.room) || USER.room == 'map' || isNull(APP.ThreeEntity)) return;

		var object = undefined;

		if(notNull(APP.roomRaycaster)) {
			object = APP.roomRaycaster({mouse:USER.mouseToTHREE(e)});
		}

		if(isNull(object)) return false;

		USER.mouseStart = USER.mouseToTHREE(e);

		if (object.db) {
			// TODO : set a generic method to progress tube
			var progress = {
				room:APP.ThreeEntity.uniforms.whitePath.value * 100,
				object:object.db.percent_progression
			};

			if(!object.db.is_finish) {

				var data = {
					user: USER.user,
					mouseStart: USER.mouseStart,
					objectId: object.db._id
				};

				socket.emit("interaction:start", data);

			} else if(object.db.is_finish) {
				new FlashMessage('Obstacle ' + object.mesh.name + ' already done.',2)

			}
		} else { //if button help
			socket.emit('send:help_request')
		}
		// else if(progress.room <= progress.object) {
		// 	new FlashMessage('You must finish previous obstacles.',2)
		// }
	}

	mouseClick(e) {
		let $el = document.querySelector('.interactions');

		if(hasClass($el,'active') && USER.room != "map") {
			USER.sendMouseMovement = true;
			removeClass($el,'active');
			new TweenMax.to('.interactions .btn-interaction',0.2, {opacity:0});
		}

		if(!CAMERA || USER.room != "map" && USER.room) return;

		// prevent instant redirecting to room
		let elementClicked = e.target;
		if(hasClass(elementClicked,'svg-back-to-map') || hasClass(elementClicked,'navigator-link')) {
			return;
		}

		var mouse = USER.mouseToTHREE(e);
		var mesh = APP.mapRaycaster(mouse,true);

		if(notNull(mesh) && notNull(mesh.roomId)) {
			Transition.zoomToMesh(mesh,function() {
				USER.leave(function () {
					USER.enter(mesh.roomId);
				});
			})
		}
	}

	openInteractions(e) {

		if(USER.room == 'map' || USER.room == 'home' ) return;

		let $el = document.querySelector('.interactions');

		if(hasClass($el,'active')) {
			USER.sendMouseMovement = true;
			removeClass($el,'active');
			new TweenMax.to('.interactions .btn-interaction',0.2, {opacity:0});
		} else {
			USER.sendMouseMovement = false;

			let position = {
				x:e.clientX,
				y:e.clientY
			};

			$el.style.left = parseInt(position.x - ($el.offsetWidth /2)) + 'px';
			$el.style.top = parseInt(position.y - $el.offsetHeight) + 'px';
			if(!hasClass($el,'active')) {
				addClass($el,'active');
				new TweenMax.staggerTo('.interactions .btn-interaction',0.2, {opacity:1},0.05);
			}
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

		// WHEN USER IS ON THE MAP
		socket.on('on:room:finish', this.onRoomFinish);

		// WHEN USER REACH A ROOM
		socket.on('user:join:room', this.userEnterRoom);

		// IF USER DISCONNECT
		socket.on('user:disconnect:room', this.userLeaveRoom);

		// GET HELP REQUESTS
		socket.on('get:help_request', this.getHelpRequest);

		socket.on('get:room:help_request', this.getRoomHelpRequest);

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

		socket.on('send:interaction', this.showInteractionPlayer);



		// ---------- DOM -----------


		// BIND MOUSE AND SEND POSITION
		document.addEventListener('mousemove', this.mouseMove);

		// WHEN USER STOP CLICKING
    document.addEventListener('mouseup', this.mouseUp);

		// USER START CLICKING
		document.addEventListener('mousedown', this.mouseDown);

		// USER CLASSIC CLICK
		document.addEventListener('click', this.mouseClick);

		if (document.addEventListener) { // IE >= 9; other browsers
			document.addEventListener('contextmenu', function(e) {
				e.preventDefault();
				USER.openInteractions(e);
			}, false);
		} else { // IE < 9
			document.attachEvent('oncontextmenu', function() {
				window.event.returnValue = false;
				USER.openInteractions(e);
			});
		}

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

	threeToWindow(mouse) {
		var obj = new THREE.Object3D();
		obj.position.x = mouse.x;
		obj.position.y = mouse.y;
		obj.position.z = mouse.z;
		var vector = new THREE.Vector3();

		var widthHalf = window.innerWidth/2;
		var heightHalf = window.innerHeight/2;

		obj.updateMatrixWorld();
		vector.setFromMatrixPosition(obj.matrixWorld);
		vector.project(CAMERA);

		vector.x = ( vector.x * widthHalf ) + widthHalf;
		vector.y = - ( vector.y * heightHalf ) + heightHalf;

		return {
			x: vector.x,
			y: vector.y
		};
	}

	enter(room, callback) {
		var _this = this;
		Transition.canScroll = false;

		this.room = room;
		if (room == "map") {
			APP = new MapController();
			APP.getMap();
			socket.emit('room:join', 'map', _this.mouse);
			if(!hasClass(document.querySelector('body'),'map')) {
				addClass(document.querySelector('body'),'map');
			}

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

		if(hasClass(document.querySelector('#result-box'),'active')) {
			removeClass(document.querySelector('#result-box'),'active');
		}

		if(hasClass(document.querySelector('body'),'map')) {
			removeClass(document.querySelector('body'),'map');
		}

		document.querySelector('#result-box .room-result').innerHTML = '';
		document.querySelector('#result-box .users-result').innerHTML = '';
		this.room = null;
		this.sendMouseMovement = false;
		this.canSendHelp = true;

		if (isFunction(callback)) {
			callback()
		}
	}
}
