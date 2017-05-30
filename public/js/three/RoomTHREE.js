class RoomTHREE {
	constructor(loadDatas) {
		this.plan = new THREE.Object3D();
		this.interactionLights = new THREE.Group();
		this.interactions = [];
		this.tube = null;
		this.avatarPlan = new THREE.Group();

		this.mouseDown = false;
		this.users = [];
		this.avatars = [];

		this.removeUsersArray = [];
		this.userHasJoin = true;
		this.meshArray = [];

		this.count = 0;
		this.countRotation = Math.PI * 1 / 3;
		this.countMove = 0;
		this.addLight();
		this.uniforms = {
			whitePath: {
				type: 'f', // a float
				value: 0
			}
		};
		//CONTROL = new THREE.OrbitControls(CAMERA, RENDERER.domElement);
		this.uniforms.whitePath.value = 0.33;
		this.percentAccomplished = this.uniforms.whitePath.value * 100;
		this.load(loadDatas)
	}

	load(data) {

		var loader = new LoaderTHREE(data,this.uniforms);
		loader.studio();
		loader.tube();
		loader.room();
		loader.interaction();

		this.plan.position.set(50, 150, -800);
		this.plan.rotation.set(0, -Math.radians(40), 0);

		this.plan.add(this.interactionLights);
		SCENE.add(this.plan);
		SCENE.add(this.avatarPlan);
	}

	update() {
		var _this = this;

		for (var i = 0; i < this.interactions.length; i++) {
				var interaction = this.interactions[i];
				interaction.update();
		}

		if(notNull(this.tube)) {
			this.tube.update(this.percentAccomplished);
		}

		for (var i = 0; i < this.users.length; i++) {

			// If user should be remove, don't animate it
			if (notNull(this.removeUsersArray[this.users[i].id])) {
				this.removeUser(this.users[i].id);
				continue;
			}

			// If user has no avatar, add it
			if (isNull(this.avatars[this.users[i].id])) {
				this.addAvatar(this.users[i])
			}

			// move from user's position
			this.moveUser(this.users[i])
		}
		if (this.users.length > 0) {
			this.userHasJoin = false
		}
	}

	addAvatar(user, callback) {
		var avatar = new AvatarTHREE(user);

		this.avatars[user.id] = avatar;
		this.avatarPlan.add(this.avatars[user.id].mesh);

		avatar.mesh.scale.set(0.01, 0.01, 0.01);
		if (typeof callback == 'function') {
			callback()
		}
	}

	removeUser(userId) {
		this.avatars[userId].scale += (0.001 - this.avatars[userId].scale) * 0.2

		this.avatars[userId].mesh.scale.set(
			this.avatars[userId].scale,
			this.avatars[userId].scale,
			this.avatars[userId].scale
		);

		if (this.avatars[userId].scale > 0.01) return

		for (var i = 0; i < this.plan.children.length; i++) {
			if (this.plan.children[i] == this.avatars[userId].mesh) {
				this.plan.remove(this.plan.children[i])
				break;
			}
		}


		delete this.avatars[userId]
		delete this.removeUsersArray[userId]

		for (var i = 0; i < this.users.length; i++) {
			if (this.users[i].id == userId) {
				this.users.splice(i, 1);
				break;
			}
		}

	}

	moveUser(user) {
		var avatar = this.avatars[user.id];

		if (isNull(avatar) || isNull(user.mouse)) return;

		if (avatar.scale <= 1) {
			avatar.scale += (1 - avatar.scale) * 0.1;

			avatar.mesh.scale.set(
				avatar.scale,
				avatar.scale,
				avatar.scale
			)
		}

		var position = avatar.mesh.position;

		if (this.userHasJoin) {
			position.x = user.mouse.x;
			position.y = user.mouse.y;
		} else {
			// ADD OFFSET BASED ON this.plan position
			position.x += (user.mouse.x - position.x) * 0.1 + 3;
			position.y += (user.mouse.y - position.y) * 0.1 - 3;
		}
	}

	movePlan(data) {
		if (!this.mouseDown) {
			// TODO : improve variable declaration
			this.plan.rotation.y = data.mouse.x / 100000 - Math.radians(40);
			//this.plan.rotation.x = data.mouse.y / 120000;
		}
	}

	setAccomplished(objectId) {
		// WARNING: id from mongodb, not from mesh
		for (var a = 0; a < this.interactions.length; a++) {
			var interaction = this.interactions[a];

			if (interaction.db._id == objectId) {
					interaction.db.is_finish = true;
					interaction.startAnimation = true;

					APP.ThreeEntity.percentAccomplished += interaction.db.percent_progression;
				break;
			}
		}
	}
	addLight() {
		var light0 = new THREE.SpotLight( 0xffffff, 1 );
		light0.position.set(0, 4000, 600);

		light0.castShadow = true;
		light0.angle = Math.PI / 4;
		light0.penumbra = 0.1;
		light0.decay = 1;
		light0.distance = 6000;
		light0.shadow.mapSize.width = 1024;
		light0.shadow.mapSize.height = 1024;
		light0.shadow.camera.near = 1;
		light0.shadow.camera.far = 1000;
		SCENE.add( light0 );

		var spot = new THREE.SpotLight( 0xffffff, 1 );
		spot.position.set(0, 1000, 300);
		spot.angle = Math.PI / 4;
		SCENE.add( spot );

		var lightAxis = new THREE.AxisHelper(200);
  		light0.add(lightAxis);

		var light = new THREE.PointLight(0xffffff, 1, 150)
		light.position.set(40, 50, 0);

		var light2 = new THREE.PointLight(0xffffff, 0, 150)
		light2.position.set(-10, 60, 70);

		var light3 = new THREE.PointLight(0xffffff, 0, 150)
		light3.position.set(-40, 40, -30);

		var sphereSize = 50;
		var pointLightHelper = new THREE.PointLightHelper( spot, sphereSize );
		SCENE.add( pointLightHelper );

		this.interactionLights.add(light2);
		this.interactionLights.add(light3);
	}

}
