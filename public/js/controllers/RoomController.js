class RoomController {
	constructor(roomId,callback) {
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

			_that.RoomTHREE = new RoomTHREE(data);

			if(isFunction(callback)) {
				callback();
			}
		});

		return this;

	}

	render() {

		if (!this.RoomTHREE) return

		this.RoomTHREE.update()
	}

	roomRaycaster(mouse) {
		if(!notNull(APP.RoomTHREE.interactions)) return false;

		var childrens = APP.RoomTHREE.interactions.children;


		RAY = new THREE.Raycaster(CAMERA.position, mouse.sub(CAMERA.position).normalize());
		var intersects = RAY.intersectObjects(childrens,true);

		if (intersects.length > 0) {
			for (var i = 0; i < intersects.length; i++) {

				var inter = intersects[i];

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
