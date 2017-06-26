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
		this.angle = 0;
		this.helpRequests = [];
		this.spots = [];
		this.roomSize = {
			x: 0.2,
			y: 0.2,
			z: 0.2
		};
		this.citySize = 1;

		createBackground(generateBackgroundTexture());

		SCENE.add(this.plan);
		// CONTROL = new THREE.OrbitControls(CAMERA, RENDERER.domElement);

		// Lights
		// var light = new THREE.PointLight('#333', 15, 0, 2);
		// light.position.set(0, 0, 0);
		// SCENE.add(light);
		var intensity = LOADER.db.map.finished / LOADER.db.map.rooms * 100;

		SOUND.testAmbiance(intensity);

		this.am = new THREE.AmbientLight('#ffffff',intensity/100);
		this.am.position.set(0,0,0);
		SCENE.add(this.am);

		this.createSpot({
			x: 0,
			y: 200,
			z: 0
		});

		this.createSpot({
			x: 0,
			y: 0,
			z: 350
		})

		this.createSpot({
			x: 0,
			y: 0,
			z: -350
		})
		// Fake avatars
		// TODO : adapt to number of person in the experiment
		this.addAvatar();

	}

	createSpot(position) {
		var spot = new THREE.SpotLight( 0xffffff, 1 );
		spot.position.set(position.x, position.y, position.z);
		spot.angle = Math.PI / 4;
		spot.decay = 1;
		spot.distance = 400;
		spot.shadow.mapSize.width = 512;
		spot.shadow.mapSize.height = 512;
		SCENE.add( spot );
		this.spots.push(spot);
		// var spotLightHelper = new THREE.SpotLightHelper( spot );
		// SCENE.add( spotLightHelper );
	}

	load() {

		for(let a in LOADER.mesh.mapRooms) {
			APP.ThreeEntity.rooms[a].mesh = LOADER.mesh.mapRooms[a];
			APP.ThreeEntity.rooms[a].setRoomFinish = this.setRoomFinish;
		}

		APP.ThreeEntity.map = LOADER.mesh.map;
		APP.ThreeEntity.map.position.y = -50;
		SCENE.add(APP.ThreeEntity.map);
	}

	update() {
		var _this = this;

		if (this.map) {
			let percent = LOADER.db.map.finished / LOADER.db.map.rooms;
			this.map.rotation.y = CLOCK.getElapsedTime()/20;
			this.map.position.y += (Math.cos(this.angle)/10) * percent;

			// SOUND.testAmbiance(percent);
		}
		this.angle += .01;

		for (var i = 0; i < this.fakeAvatars.length; i++) {
			this.fakeAvatars[i].rotation.x += this.fakeAvatars[i].speed / 7000;
			this.fakeAvatars[i].rotation.y += this.fakeAvatars[i].speed / 7000;
			this.fakeAvatars[i].rotation.z += this.fakeAvatars[i].speed / 7000;
		}

		if (isNull(this.rooms)) return;

		var room = {};
		var room_finished = 0;
		for (var e = 0; e < this.rooms.length; e++) {
			room = this.rooms[e];

			// Explanation :
			// Loop on all request, if the room is present, we specify it need visual update

			if(notNull(room.mesh) && room.mesh.canAnimateFinalState) {
				if(room.mesh.isHover) {
						// room.mesh.material.color.set(RoomMaterial().color.hover);
						room.mesh.material.emissive = new THREE.Color(RoomMaterial().color.hover);
						room.mesh.material.emissiveIntensity = 1;
				} else {
					room.mesh.material.emissive = new THREE.Color(RoomMaterial().color.basic);
					room.mesh.material.emissiveIntensity = 0;
					// room.mesh.material.color.set(RoomMaterial().color.basic);
				}
			}

			for (var a = 0; a < this.helpRequests.length; a++) {
				if (room._id == this.helpRequests[a].roomId && !room.mesh.isHover) {
					this.rooms[e].hasHelpRequest = true;
					room.mesh.material.emissiveIntensity = 1;
					room.mesh.material.emissive = new THREE.Color(RoomMaterial().color.help_request);
				} else if(room.mesh.isHover && room._id == this.helpRequests[a].roomId) {
				 room.mesh.material.emissive = new THREE.Color(RoomMaterial().color.help_request_hover);
				 room.mesh.material.emissiveIntensity = 1;
			 }

			}

			// Become false to force help_request's room on each loop
			room.hasHelpRequest = false;

			if(room.is_finish && isFunction(room.setRoomFinish)) {
				room.setRoomFinish();
			}

			for (var i = 0; i < APP.ThreeEntity.spots.length; i++) {
				var spot = this.spots[i];
				spot.decay = 1 - LOADER.db.map.finished / LOADER.db.map.rooms;
			}
		}
	}

	setRoomFinish() {
		var _this = this;
		if(this.mesh.canAnimateFinalState) {
			this.mesh.canAnimate = false;
			this.mesh.canAnimateFinalState = false;
			this.mesh.canAnimate = false;
			this.mesh.material = RoomMaterial().material.finished

			var color = {v:'#'+ new THREE.Color(this.mesh.material.color).getHexString()};

			var timeline = new TimelineMax();
			timeline
			.delay(randFloat(0,5))
			.to(color,1,{
				v:RoomMaterial().color.room_finish,
				onUpdate:function() {
					_this.mesh.material.color.set(color.v);
				}}
			)
			.to(_this.mesh.position,_this.mesh.rand_ease,{
				x:_this.mesh.position_origin.x,
				y:_this.mesh.position_origin.y,
				z:_this.mesh.position_origin.z,
				ease:Quart.easeInOut,
				onComplete:function() {
						LOADER.db.map.finished++;
						BACKGROUND.material = generateBackgroundTexture()
						_this.am = LOADER.db.map.finished / LOADER.db.map.rooms * 100;

						SOUND.testAmbiance(_this.am);
				}
			})
		}
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
