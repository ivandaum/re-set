class RoomController {
	constructor(roomId,callback) {
		INITIAL_CAMERA = 210;
		CAMERA = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 1, 1000);

		document.querySelector('#canvas-container').innerHTML = "";
		document.querySelector('#canvas-container').appendChild(RENDERER.domElement);

		this.id = roomId;
		this.setCamera();
		Transition.roomNav.show();

		var _that = this;

		var room = Ajax.get('/api/room/' + roomId + '/interactions', function(data) {

			if(data == 500) {
				APP = new IndexController();
				APP.jumpToMap();
				return;
			}

			data = JSON.parse(data);

			if(data.room.length == 0 || data.interactions == 0) {
				APP = new IndexController();
				APP.jumpToMap();
				return;
			}

			_that.ThreeEntity = new RoomTHREE(data);
			_that.ThreeEntity.usersVectors = [];

			if(isFunction(callback)) {
				callback();
			}
		});

		return this;

	}

	render() {

		if (!this.ThreeEntity) return

		this.ThreeEntity.update()
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
