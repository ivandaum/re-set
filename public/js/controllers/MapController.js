class MapController {
	constructor() {

		INITIAL_CAMERA = 250;
		CAMERA = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 800);

		RENDERER.setClearColor('#000');

		document.querySelector('#canvas-container').innerHTML = "";
		document.querySelector('#canvas-container').appendChild(RENDERER.domElement);

		this.setCamera();
		this.ThreeEntity = new MapTHREE();
		CONTROL = "";
		return this;
	}

	render() {

		if (this.ThreeEntity) {
			this.ThreeEntity.update();
		}
	}

	getMap() {
		var _this = this;
		Navigator.goTo('canvas-container');
		Ajax.get('/api/rooms', function (data) {
			var parsed = JSON.parse(data);
			_this.ThreeEntity.rooms = parsed.rooms;
			_this.ThreeEntity.load();
			socket.emit('get:help_request');
		});
	}

	mapRaycaster(mouse) {

		var childrens = [];

		for(var a=0; a<this.ThreeEntity.rooms.length; a++) {
			childrens.push(this.ThreeEntity.rooms[a].mesh);
		}


		RAY = new THREE.Raycaster(CAMERA.position, mouse.sub(CAMERA.position).normalize());
		var intersects = RAY.intersectObjects(childrens);

		var child = {};
		// for (var a = 0; a < childrens.length; a++) {
		//
		// 	child = childrens[a];
		//
		// 	if (notNull(child.roomId)) {
		//
		// 		this.ThreeEntity.normalMaterial(child);
		// 	}
		// }

		for (var i = 0; i < intersects.length; i++) {
			child = intersects[i].object;

			if(notNull(child.roomId)) {
				this.ThreeEntity.hoverRoom = child.roomId;
			}

			//hover test à remettre dans le if
			this.ThreeEntity.makeRoomGlow(child);
			if (notNull(child.roomId)) {
				this.ThreeEntity.makeRoomGlow(child);
				break;
			}
		}

	}

	setCamera() {
		RENDERER.setSize(window.innerWidth, window.innerHeight);

		CAMERA.position.z = INITIAL_CAMERA;
		CAMERA.position.x = 0;
		CAMERA.position.y = 500;
		CAMERA.lookAt({x: 0, y: 0, z: 0})
	}
}
