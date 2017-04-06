var MapController = function () {
	SCENE = new THREE.Scene();
	RENDERER = new THREE.WebGLRenderer({antialias: true});

	INITIAL_CAMERA = 150;
	CAMERA = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
	RAY = new THREE.Raycaster();

	RENDERER.setClearColor('#000');

	// document.querySelector('#canvas-container').innerHTML = "";
	// document.querySelector('#canvas-container').appendChild(RENDERER.domElement);

	this.RoomTHREE = new MapTHREE();

	return this;
};

MapController.prototype = {
	render: function() {

	},
	getMap: function () {
		var _this = this;

		Navigator.goTo('canvas-container');
		Ajax.get('/api/rooms', function (data) {
			// _this.bindRooms();
			document.querySelector('#canvas-container').innerHTML = data
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
		CAMERA.position.y = 2;
		CAMERA.lookAt({x: 0, y: 2, z: 0})
	}
};
