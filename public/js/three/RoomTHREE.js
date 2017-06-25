class RoomTHREE {
	constructor(datas) {
		this.plan = new THREE.Object3D();
		this.plan.name = "primary_plan";

		this.interactionLights = new THREE.Group();
		this.avatarPlan = new THREE.Group();
		this.avatarPlan.name = 'avatar_plan';
		this.linePlan = new THREE.Group();
		this.avatarPlan.name = 'line_plan';
		this.interactionLights = new THREE.Group();
		this.avatarPlan.name = 'interactions_light';
		this.interactions = [];
		this.tube = null;
		this.help = false;
		this.canActivateHelp = true;

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

		SCENE.add(this.interactionLights);
		SCENE.add(this.plan);
		SCENE.add(this.avatarPlan);
		SCENE.add(this.linePlan);

		this.xMax = 0.6;
		this.xMin = 1;

		this.yMin = 0;
		this.yMax = window.innerHeight < 700 ? window.innerHeight : 700;

		this.percentAccomplished = this.uniforms.whitePath.value * 100;

		var groundMirror = new THREE.Mirror( 120, 120, { clipBias: 0.003, textureWidth: window.innerWidth, textureHeight: window.innerHeight, color: 0x2B2B2B } );
		groundMirror.rotation.x = -Math.radians(90);
		groundMirror.position.z = 60;
		groundMirror.position.y = 4.4;
		groundMirror.position.x = 60;

		groundMirror.opacity = 0.5;
		this.plan.add( groundMirror );

		this.load(datas);

	}

	load(datas) {

		this.studio = datas.mesh.studio.clone();
		this.studio.rotation.set(0, -Math.radians(55), 0);
		SCENE.add(this.studio);

		var tube = datas.mesh.tube.clone()
		tube.children[0].material.uniforms.whitePath.value = 0;

		if(datas.db.room.is_finish) {
			tube.children[0].material.uniforms.whitePath.value = 100;
		}

		this.tube = new TubeTHREE(tube);
		this.plan.add(tube);
		this.plan.add(datas.mesh.room.clone());

		var button = datas.mesh.helpButton.clone();
		this.button = new ButtonTHREE(button);
		this.plan.add(button);

		for(let i=0; i<datas.mesh.interactions.length; i++) {
			var mesh = datas.mesh.interactions[i].clone();

			mesh.originalPosition = datas.mesh.interactions[i].originalPosition;
			mesh.originalRotation = datas.mesh.interactions[i].originalRotation;

			this.plan.add(mesh);
			this.interactions.push(new InteractionTHREE(mesh,datas.db.interactions[i]));
			if(datas.db.interactions[i].is_finish) {

				if(datas.db.interactions[i].percent_progression > this.percentAccomplished) {
					this.percentAccomplished += datas.db.interactions[i].percent_progression;
				}

				var n = this.interactions.length -1;
				this.interactions[n].setFinished();
			}
		}

		this.linePlan.position.set(0, 0, -30);
		this.plan.position.set(5, 15, -170);
		this.plan.rotation.set(-Math.radians(4), -Math.radians(45), 0);
	}

	update() {

		var _this = this;

		for (var i = 0; i < this.interactions.length; i++) {
			var interaction = this.interactions[i];
			interaction.update(this.usersVectors);
			if(!interaction.db.is_finish) {
				if(interaction.db.percent_progression > this.percentAccomplished) {
					this.percentAccomplished = interaction.db.percent_progression;
				}
				break;
			}
		}

		for (var i = 0; i < this.usersVectors.length; i++) {
			if (this.usersVectors[i].vectorEnd) {
				this.usersVectorsDraw(this.usersVectors[i]);
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

	addVectorsDraw(user){
		var _this = this;
		if(isNull(this.avatars[user])) {
			this.addAvatar(user,function() {
					_this.linePlan.add(_this.avatars[user].dragLine.interactionLine);
			})
		} else {
			this.linePlan.add(this.avatars[user].dragLine.interactionLine);
		}
	}

	usersVectorsDraw(vectorData) {
		if (this.avatars[vectorData.user.id]) {
			this.avatars[vectorData.user.id].dragLine.update(vectorData);
		}
	}

	removeVectorsDraw(user){
		this.avatars[user].dragLine.rebootLine();
		this.linePlan.remove(this.avatars[user].dragLine.interactionLine);
	}

	addAvatar(user, callback) {
		var avatar = new AvatarTHREE(user);

		this.avatars[user.id] = avatar;

		this.avatars[user.id].dragLine = new LineTHREE();

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

		avatar.mesh.rotation.y += 0.005;

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
			//let ratio = window.innerWidth < 1000 ? 10000 : 7000;
			//this.plan.rotation.y = data.mouse.x / ratio - Math.radians(45);
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

					APP.ThreeEntity.percentAccomplished += interaction.db.percent_progression;
				break;
			}
		}
	}
	addLight() {

		var light = new THREE.HemisphereLight( 0x262626, 0xe2e2e2, 0.5 );

		SCENE.add( light );


		var position1 = {
			x: 75,
			y: 120,
			z: 60,
			tx:0,
			ty:0,
			tz:-150
		};
		var position2 = {
			x: -75,
			y: 120,
			z: 60,
			tx:0,
			ty:0,
			tz:-150
		};
		var position3 = {
			x: 0,
			y: 150,
			z: -200,
			tx:0,
			ty:0,
			tz:-0
		};

		// this.createSpot(position1);
		// this.createSpot(position2);
		// this.createSpot(position3);

	}
	createSpot(position) {
		var spot = new THREE.SpotLight( 0xe2e2e2, 2 );
		spot.position.set(position.x, position.y, position.z);
		spot.angle = Math.PI / 5;
		spot.castShadow = true;
		spot.penumbra = 1;
		spot.decay = 1;
		spot.distance = 250;
		spot.shadow.mapSize.width = 512;
		spot.shadow.mapSize.height = 512;
		spot.shadow.camera.near = 1;
		spot.shadow.camera.far = 2;
		SCENE.add( spot.target );
		spot.target.position.x = position.tx;
		spot.target.position.y = position.ty;
		spot.target.position.z = position.tz;
		SCENE.add( spot );

	}

}
