class RoomController {
	constructor(roomId) {
		SCENE = new THREE.Scene();
		RENDERER = new THREE.WebGLRenderer({antialias: true});

		INITIAL_CAMERA = 150;
		CAMERA = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);

		RENDERER.setClearColor('#000');

		document.querySelector('#canvas-container').innerHTML = "";
		document.querySelector('#canvas-container').appendChild(RENDERER.domElement);

		this.id = roomId;
		this.setCamera();

		var _that = this;
		var room = Ajax.get('/api/room/' + roomId + '/interactions', function(data) {
			data = JSON.parse(data);
			_that.RoomTHREE = new RoomTHREE(data);
		});

		return this;

	}

	render() {

		if (!this.RoomTHREE) return

		this.RoomTHREE.update()
	}

	roomRaycaster(mouse) {
		if(typeof APP.RoomTHREE.interactions == 'undefined') return false;

		var childrens = APP.RoomTHREE.interactions.children;


		RAY = new THREE.Raycaster(CAMERA.position, mouse.sub(CAMERA.position).normalize());
		var intersects = RAY.intersectObjects(childrens,true);

		if (intersects.length > 0) {
			for (var i = 0; i < intersects.length; i++) {

				var inter = intersects[i];

				// TODO : switch object
				switch (inter.object.draggable) {
					case "roue":
						inter.object.startRotate = true;
						break;
					case "block":
						break;
				}

				return inter;
			}
		}

	}

	setCamera() {
		RENDERER.setSize(window.innerWidth, window.innerHeight);
		CAMERA.position.z = INITIAL_CAMERA;
		CAMERA.position.x = 0;
		CAMERA.position.y = 2;
		CAMERA.lookAt({x: 0, y: 0, z: 0})
	}
}
