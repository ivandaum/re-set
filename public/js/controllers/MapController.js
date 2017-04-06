var MapController = function () {
	SCENE = new THREE.Scene();
	RENDERER = new THREE.WebGLRenderer({antialias: true});

	INITIAL_CAMERA = 5;
	CAMERA = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
	RAY = new THREE.Raycaster();

	RENDERER.setClearColor('#000');

	document.querySelector('#canvas-container').innerHTML = "";
	document.querySelector('#canvas-container').appendChild(RENDERER.domElement);

	this.setCamera();
	this.RoomTHREE = new MapTHREE();

	return this;
};

MapController.prototype = {
	render: function() {

		if(this.RoomTHREE) {
			this.RoomTHREE.update();
		}
	},
	getMap: function () {
		var _this = this;
		Navigator.goTo('canvas-container');
		Ajax.get('/api/rooms', function (data) {
			var parsed = JSON.parse(data);
			_this.RoomTHREE.rooms = parsed.rooms;
		});
	},
	bindRooms: function () {
		var rooms = document.querySelectorAll('.room');

		for (var i = 0; i < rooms.length; i++) {
			var room = rooms[i];
			room.addEventListener('click', function (e) {
				e.preventDefault();

				var roomId = this.dataset.id;
				USER.enter(roomId);
			})
		}
	},
	setCamera: function () {
		RENDERER.setSize(window.innerWidth, window.innerHeight);

		CAMERA.position.z = INITIAL_CAMERA;
		CAMERA.position.x = 0;
		CAMERA.position.y = 0;
		CAMERA.lookAt({x: 0, y: 0, z: 0})
	}
};
