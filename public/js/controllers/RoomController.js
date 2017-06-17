class RoomController {
	constructor(roomId,callback) {
		INITIAL_CAMERA = 210;
		CAMERA = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 1, 1000);

		document.querySelector('#canvas-container').innerHTML = "";
		document.querySelector('#canvas-container').appendChild(RENDERER.domElement);

		this.id = roomId;
		this.setCamera();
		this.interactionsMessages = [];

		Transition.roomNav.show();

		var _that = this;


		if(LOADER.db.rooms.length < 1) {
			LOADER.init(function() {
				_that.init(callback);
			})
		} else {
			_that.init(callback);
		}

		return this;
	}

	init(callback) {
		let data = LOADER.getRoom(this.id);

		if(isNull(data.db.room) || data.db.interactions.length == 0) {
			USER.leave(function() {
				USER.enter('map');
			});
			return false;
		}

		this.ThreeEntity = new RoomTHREE(data);
		this.ThreeEntity.usersVectors = [];

		var interactions = data.db.interactions;

		var interactionNotFinished = 0;
		for(var e=0;e<interactions.length;e++) {
			if(interactions[e].is_finish == false) interactionNotFinished++;
		}

		if(interactionNotFinished == 0) {
			socket.emit('get:room:participation',{room:roomId});
		}

		if(isFunction(callback)) {
			callback();
		}
	}

	render() {

		if (!this.ThreeEntity) return;

		this.ThreeEntity.update()


		for(let p=0; p<this.interactionsMessages.length; p++) {
			if(this.interactionsMessages[p].DOM == false) {
				this.interactionsMessages.splice(p,1);
				continue;
			}

			this.interactionsMessages[p].update();
		}
	}

	roomRaycaster(mouse) {
		if(!notNull(APP.ThreeEntity.interactions) && !notNull(APP.ThreeEntity.button)) return false;

		var childrens = [];
		var childrensMesh = [];

		// forming three chilrens
		for (var i = 0; i < APP.ThreeEntity.interactions.length; i++) {
			childrensMesh.push(APP.ThreeEntity.interactions[i].mesh);
			childrens.push(APP.ThreeEntity.interactions[i]);
		}
		childrensMesh.push(APP.ThreeEntity.button.mesh);
		childrens.push(APP.ThreeEntity.button);

		RAY = new THREE.Raycaster(CAMERA.position, mouse.sub(CAMERA.position).normalize());
		var intersects = RAY.intersectObjects(childrensMesh,true);

		if (intersects.length > 0) {
			for (var i = 0; i < intersects.length; i++) {
				for (var a = 0; a < childrensMesh.length; a++) {
					if(childrensMesh[a].uuid ==  intersects[i].object.parent.uuid) {
						return childrens[a];
					}
				}
			}
		}

	}

	setCamera() {
		RENDERER.setSize(window.innerWidth, window.innerHeight);
		CAMERA.position.z = INITIAL_CAMERA;
		CAMERA.position.x = -10;
		CAMERA.position.y = 130;
		CAMERA.lookAt({x: 0, y: 70, z: 0})

	}
}
