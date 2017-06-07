class RoomTHREE {
	constructor(loadDatas) {
		this.plan = new THREE.Object3D();
		this.interactionLights = new THREE.Group();
		this.avatarPlan = new THREE.Group();
		this.interactionLights = new THREE.Group();
		this.interactions = [];
		this.tube = null;

		this.mouseDown = false;
		this.oldMouse = window.innerWith / 2;
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

		this.xMax = 0.6;
		this.xMin = 1;

		this.yMin = 0;
		this.yMax = window.innerHeight < 700 ? window.innerHeight : 700;

		this.uniforms.whitePath.value = 0;
		this.percentAccomplished = this.uniforms.whitePath.value * 100;
		this.load(loadDatas)


		var geometry = new THREE.BoxBufferGeometry( 20, 20, 20 );
		var material = new THREE.MeshLambertMaterial( { envMap: CUBECAMERA.renderTarget.texture } );
		this.cube = new THREE.Mesh( geometry, material );
		this.cube.position.set(110,20,10);
		//this.plan.add( this.cube );


		var material2 = new THREE.MeshPhongMaterial( {color: 0x00ffff} );
		this.cube2 = new THREE.Mesh( geometry, material2 );
		this.cube2.position.set(110,20,50);
		//this.plan.add( this.cube2 );

		var groundMirror = new THREE.Mirror( 120, 120, { clipBias: 0.003, textureWidth: window.innerWidth, textureHeight: window.innerHeight, color: 0x2B2B2B } );
		groundMirror.rotation.x = -Math.radians(90);
		groundMirror.position.z = 60;
		groundMirror.position.y = 4.4;
		groundMirror.position.x = 60;
		groundMirror.opacity = 0.5;
		this.plan.add( groundMirror );
	}

	load(data) {

		var loader = LOADER_THREE;
		LOADER_THREE.setDatas(data,this.uniforms);
		loader.studio();
		loader.tube();
		loader.room();
		loader.interaction();

		this.plan.position.set(5, 15, -170);
		this.plan.rotation.set(0, -Math.radians(40), 0);

		SCENE.add(this.interactionLights);
		SCENE.add(this.plan);
		SCENE.add(this.avatarPlan);

	}

	update() {
		var _this = this;

		if (this.cube) {
			this.cube.visible = false;
  		  	CUBECAMERA.position.copy( this.cube.position );
      	  	CUBECAMERA.updateCubeMap(RENDERER, SCENE);
		  	this.cube.visible = true;
  	  }

		for (var i = 0; i < this.interactions.length; i++) {
				var interaction = this.interactions[i];
				interaction.update();
		}

		for (var a = 0; a < this.interactions.length; a++) {
			interaction = this.interactions[a];
			if(!interaction.db.is_finish) {
				if(interaction.db.percent_progression > this.percentAccomplished) {
					this.percentAccomplished = interaction.db.percent_progression;
				}
				break;
			}
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
		var scale = avatar.mesh.scale;

		if (this.userHasJoin) {
			position.x = user.mouse.x;
			position.y = user.mouse.y;
		} else {
			// ADD OFFSET BASED ON this.plan position
			position.x += (user.mouse.x - position.x) * 0.1;
			position.y += (user.mouse.y - position.y) * 0.1;

			const percent = (user.mouse.y - this.yMin) / (this.yMax - this.yMin);
			const scaledValue = percent * (this.xMax - this.xMin) + this.xMin;
			scale.x = scaledValue;
			scale.y = scaledValue;
			scale.z = scaledValue;
		}
	}

	movePlan(data) {
		if (!this.mouseDown) {
			let ratio = window.innerWidth < 1000 ? 10000 : 7000;
			this.plan.rotation.y = data.mouse.x / ratio - Math.radians(40);

		}
		// test mouvement camera
		// let x = CAMERA.position.x,
		//   y = CAMERA.position.y,
		//   z = CAMERA.position.z;
		//
		// let mouse = data.clientX;
		//
		// if (!this.mouseDown) {
		// 	var speed = 0.005;
		// 	if (mouse < this.oldMouse){
		// 	  CAMERA.position.x = x * Math.cos(speed) + z * Math.sin(speed);
		// 	  CAMERA.position.z = z * Math.cos(speed) - x * Math.sin(speed);
		// 	} else {
		// 	  CAMERA.position.x = x * Math.cos(speed) - z * Math.sin(speed);
		// 	  CAMERA.position.z = z * Math.cos(speed) + x * Math.sin(speed);
		// 	}
		// 	this.oldMouse = mouse;
		// 	CAMERA.lookAt({x: 0, y: 50, z: 0})
		// }
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
		var pointlight = new THREE.PointLight( 0xffffff, 0.1 , 200, 0.5 );
		pointlight.position.set(0, 100, -25);
		//SCENE.add( pointlight );

		// var light = new THREE.AmbientLight( 0x404040 ); // soft white light
		// SCENE.add( light );

		var pointLightHelper = new THREE.PointLightHelper( pointlight, 10 );
		SCENE.add( pointLightHelper );

		var position1 = {
			x: 60,
			y: 70,
			z: -70
		};
		var position2 = {
			x: -60,
			y: 70,
			z: -70
		};

		this.createSpot(position1);
		this.createSpot(position2);

	}
	createSpot(position) {
		var spot = new THREE.SpotLight( 0xffffff, 4 );
		spot.position.set(position.x, position.y, position.z);
		spot.angle = Math.PI / 3;
		// spot.castShadow = true;
		spot.penumbra = 1;
		spot.decay = 2;
		spot.distance = 250;
		spot.shadow.mapSize.width = 512;
		spot.shadow.mapSize.height = 512;
		spot.shadow.camera.near = 1;
		spot.shadow.camera.far = 2;
		SCENE.add( spot );

		// var spotLightHelper = new THREE.SpotLightHelper( spot );
		// SCENE.add( spotLightHelper );
	}

}
