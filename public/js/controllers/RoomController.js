class RoomController {
	constructor(roomId,callback) {
		SCENE = new THREE.Scene();
		RENDERER = new THREE.WebGLRenderer({antialias: true, alpha: true});
		RENDERER.setPixelRatio( window.devicePixelRatio );
		RENDERER.shadowMap.enabled = true;
		RENDERER.shadowMap.type = THREE.PCFSoftShadowMap;
		RENDERER.shadowMapSoft = true;

		INITIAL_CAMERA = 2500;
		CAMERA = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 1, 6000);

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

			_that.ThreeEntity = new RoomTHREE(data);

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
		if(!notNull(APP.ThreeEntity.interactions)) return false;

		var childrens = [];

		// forming three chilrens
		for (var i = 0; i < APP.ThreeEntity.interactions.length; i++) {
			childrens.push(APP.ThreeEntity.interactions[i].mesh)
		}

		RAY = new THREE.Raycaster(CAMERA.position, mouse.sub(CAMERA.position).normalize());
		var intersects = RAY.intersectObjects(childrens,true);

		if (intersects.length > 0) {
			for (var i = 0; i < intersects.length; i++) {

				for (var a = 0; a < childrens.length; a++) {
					if(childrens[a].uuid ==  intersects[i].object.parent.uuid) {
						return APP.ThreeEntity.interactions[a];
					}
				}
			}
		}

	}

	setCamera() {
		RENDERER.setSize(window.innerWidth, window.innerHeight);
		CAMERA.position.z = INITIAL_CAMERA;
		CAMERA.position.x = 0;
		CAMERA.position.y = 1600;
		CAMERA.lookAt({x: 0, y: 600, z: 0})
	}
}
