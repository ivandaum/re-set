class MapTHREE {
	constructor(name) {
		this.plan = new THREE.Object3D();
		this.users = [];
		this.name = name;
		this.rooms = [];
		this.userHasJoin = true;
		this.hoverRoom = null;

		this.roomMaterial = {
			basic: new THREE.MeshLambertMaterial({color: '#ffffff'}),
			hover: new THREE.MeshLambertMaterial({color: '#ff0000'}),
			help: new THREE.MeshBasicMaterial({color: '#eeeeee'})
		};
		this.helpRequests = [];

		this.roomSize = {
			x: 0.2,
			y: 0.2,
			z: 0.2
		};
		this.citySize = 1;
		CONTROL = new THREE.OrbitControls(CAMERA, RENDERER.domElement);

		SCENE.add(this.plan);
		var Ambient = new THREE.AmbientLight('#eee');
		Ambient.position.set(0, 0, 0);
		SCENE.add(Ambient);

		var light = new THREE.PointLight('#333', 10, 100);
		light.position.set(15, 15, 15);
		SCENE.add(light);

		this.createCity();
	}

	update() {

		if (typeof this.rooms == 'undefined') return;

		var help = null;
		var room = {};
		for (var e = 0; e < this.rooms.length; e++) {
			room = this.rooms[e];

			// create room
			if (typeof room.mesh == 'undefined') {

				room.mesh = this.createRoomPreview(room);
				room.mesh.roomId = room._id;
				room.scale = 1;
				room.scaleIsGrowing = true;
				room.hasRequest = false;
				this.plan.add(room.mesh);
				var position = this.generateRoomPosition(e);
				room.mesh.position.set(position.x, position.y, position.z);
			}


			// Explanation :
			// Loop on all request, if the room is present, we specify it need visual update
			for (var a = 0; a < this.helpRequests.length; a++) {

				if (room._id == this.helpRequests[a].roomId) {
					room.helpNeeded = true;
					room.hasRequest = true;
					break;
				}

			}

			// If the room wasn't in the loop, we specify it must go to original state
			if (!room.hasRequest) {
				room.helpNeeded = false;
			}

			// Become false to force help_request's room on each loop
			room.hasRequest = false;

			this.animateRoom(room);
		}

	}

	animateRoom(room) {
		if (room.helpNeeded) {

			if (room.scaleIsGrowing) {
				room.scale += (2 - room.scale) * 0.01;
			} else {
				room.scale += (1.2 - room.scale) * 0.01;
			}

			if (room.scale >= 1.9) {
				room.scaleIsGrowing = false;
			} else if (room.scale <= 1.3) {
				room.scaleIsGrowing = true;
			}
		} else {
			room.scale += (1 - room.scale) * 0.1;
		}

		room.mesh.scale.set(room.scale, room.scale, room.scale);
	}

	createCity() {
		var geometry = new THREE.SphereGeometry(
			this.citySize,
			50,
			50
		);

		var material = new THREE.MeshLambertMaterial({color: '#333'});
		material.needsUpdate = true;

		var mesh = new THREE.Mesh(geometry, material);

		this.plan.add(mesh);

		mesh.position = new THREE.Vector3(0, 0, 0);
	}

	generateRoomPosition(e) {
		var count = this.rooms.length;
		var perc = count / 100 * 360;

		var angle = (e * perc) * Math.PI / 180;

		var x = Math.cos(angle);
		var y = -this.citySize + 2 * (this.citySize / count * e);
		var z = Math.sin(angle);

		return {
			x: x,
			y: y,
			z: z
		}

	}

	makeRoomGlow(object) {
		object.material = this.roomMaterial.hover;
		this.hoverRoom = object.roomId;
	}

	normalMaterial(object) {
		object.material = this.roomMaterial.basic;
		this.hoverRoom = null;
	}

	createRoomPreview() {
		var geometry = new THREE.BoxGeometry(
			this.roomSize.x,
			this.roomSize.y,
			this.roomSize.z
		);

		var material = this.roomMaterial.basic;
		return new THREE.Mesh(geometry, material);
	}
}
