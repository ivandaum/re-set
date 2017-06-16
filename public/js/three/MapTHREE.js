class MapTHREE {
	constructor(name) {
		this.plan = new THREE.Object3D();
		this.users = [];
		this.name = name;
		this.rooms = [];
		this.userHasJoin = true;
		this.hoverRoom = null;
		this.meshs = [];
		this.fakeAvatars = [];

		this.roomMaterial = {

			basic: new THREE.MeshBasicMaterial({color: '#e6e6e6'}),
			hover: new THREE.MeshLambertMaterial({color: '#ff7212'}),
			help: new THREE.MeshBasicMaterial({color: '#eeeeee'}),
			finished: new THREE.MeshBasicMaterial({color: '#ff00ff'})
		};
		this.helpRequests = [];
		this.roomSize = {
			x: 0.2,
			y: 0.2,
			z: 0.2
		};
		this.citySize = 1;

		generateBackground();

		SCENE.add(this.plan);
		CONTROL = new THREE.OrbitControls(CAMERA, RENDERER.domElement);

		// Lights
		var light = new THREE.PointLight('#333', 15, 0, 2);
		light.position.set(0, 0, 0);
		SCENE.add(light);

		var position1 = {
			x: 250,
			y: 100,
			z: 150
		};
		var position2 = {
			x: -250,
			y: 100,
			z: -150
		};

		this.createSpot(position1);
		this.createSpot(position2);

		// Fake avatars
		// TODO : adapt to number of person in the experiment
		this.addAvatar();

	}
	createSpot(position) {
		var spot = new THREE.SpotLight( 0xffffff, 30 );
		spot.position.set(position.x, position.y, position.z);
		spot.angle = Math.PI / 6;
		spot.decay = 2;
		spot.distance = 400;
		spot.shadow.mapSize.width = 512;
		spot.shadow.mapSize.height = 512;
		SCENE.add( spot );

		var spotLightHelper = new THREE.SpotLightHelper( spot );
		//SCENE.add( spotLightHelper );
	}

	load() {

		var loader = new LoaderTHREE(null,null);
		loader.map();
	}

	update() {
		var _this = this;

		if (this.map) {
			this.map.rotation.y = CLOCK.getElapsedTime()/50;
		}

		for (var i = 0; i < this.fakeAvatars.length; i++) {
			this.fakeAvatars[i].rotation.x += this.fakeAvatars[i].speed / 7000;
			this.fakeAvatars[i].rotation.y += this.fakeAvatars[i].speed / 7000;
			this.fakeAvatars[i].rotation.z += this.fakeAvatars[i].speed / 7000;
		}

		if (!notNull(this.rooms)) return;

		var room = {};
		for (var e = 0; e < this.rooms.length; e++) {
			room = this.rooms[e];
			//
			// // create room
			// if (!notNull(room.mesh)) {
			//
			// 	room.mesh = this.createRoomPreview(room);
			// 	room.mesh.roomId = room._id;
			// 	room.scale = 1;
			// 	room.scaleIsGrowing = true;
			// 	room.hasRequest = false;
			// 	this.plan.add(room.mesh);
			// 	var position = this.generateRoomPosition(e);
			// 	room.mesh.position.set(position.x, position.y, position.z);
			//
			// 	this.meshs.push(room.mesh);
			// }


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

			// this.animateRoom(room);
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


	makeRoomGlow(object) {
		object.material = this.roomMaterial.hover;
		this.hoverRoom = object.roomId;
	}

	finishedRoom(object) {
		object.material = this.roomMaterial.finished;
		this.hoverRoom = object.roomId;
	}

	normalMaterial(object) {
		object.material = this.roomMaterial.basic;
		this.hoverRoom = null;
	}

	addAvatar(user, callback) {
		for (var i = 0; i < rand(5, 30); i++) {
			var avatar = new AvatarTHREE(null);
			var position = randomSpherePoint(0, 0, 0, rand(200, 300));
			avatar.mesh.position.set(position[0], position[1], position[2]);
			var parent = new THREE.Object3D();
			parent.speed = rand(1,5);
			parent.rotation.x = Math.radians(rand(0,360));
			parent.rotation.z = Math.radians(rand(0,360));
			parent.rotation.z = Math.radians(rand(0,360));
			parent.add(avatar.mesh);
			this.fakeAvatars.push(parent);
			SCENE.add(parent);
		}

		if (typeof callback == 'function') {
			callback()
		}
	}
}
