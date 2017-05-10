class RoomTHREE {
	constructor(loadDatas) {
		this.plan = new THREE.Object3D();
		this.interactions = new THREE.Group();
		this.interactionLights = new THREE.Group();
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

		this.initLoader();
		this.addLight();

		this.uniforms = {
			whitePath: {
				type: 'f', // a float
				value: 0
			}
		};
		this.uniforms.whitePath.value = 0.33;
		this.load(loadDatas);
	}

	load(data) {
		var manager = new THREE.LoadingManager();
		var texture = new THREE.Texture();
		this.OBJLoader = new THREE.OBJLoader(manager);
		this.size = 1.2;

		// LOAD
		this.loader.tube(this, data);
		this.loader.room(this, data);
		this.loader.interaction(this, data);


		this.plan.position.set(5, -25, -20);
		this.plan.rotation.set(0.1, -0.7, 0);

		this.plan.add(this.interactions);
		this.plan.add(this.interactionLights);
		SCENE.add(this.plan);
		SCENE.add(this.avatarPlan);
	}

	update() {
		var _this = this;

		for (var i = 0; i < this.interactions.children.length; i++) {

			if (this.interactions.children[i].startAnimation) {
				switch (this.interactions.children[i].name) {
					case "wheel":
						var rotation = (0.000001 - this.countRotation) * 0.03;
						this.countRotation += rotation;
						this.interactions.children[i].rotation.x = this.countRotation;
						if (this.countRotation < 0.1) {
							this.interactions.children[i].startAnimation = false;
							this.count = 0;
							this.firstStep = true;
						}
						break;
					case "block":
						this.countMove += 0.01;
						this.interactions.children[i].position.y -= this.countMove;
						if (this.interactions.children[i].position.y < -9) {
							this.interactions.children[i].startAnimation = false;
							this.count = 0;
							this.secondStep = true;
						}
						break;
				}

			}
		}
		//console.log(this.uniforms.whitePath.value);
		// TODO: Refactore pipe avancement
		if (this.firstStep && this.uniforms.whitePath.value < 0.6) {
			this.count += 0.0001;
			this.uniforms.whitePath.value += Math.sin(this.count);
			this.interactionLights.children[2].intensity += this.count*5;
		}
		if (this.secondStep && this.uniforms.whitePath.value < 1) {
			this.count += 0.0001;
			this.uniforms.whitePath.value += Math.sin(this.count);
			this.interactionLights.children[1].intensity += this.count*3;
		}


		for (var i = 0; i < this.users.length; i++) {
			if (typeof this.removeUsersArray[this.users[i].id] != 'undefined') {
				this.removeUser(this.users[i].id);
				continue;
			}

			if (typeof this.avatars[this.users[i].id] == 'undefined') {
				this.addAvatar(this.users[i])
			}

			this.moveUser(this.users[i])
		}

		if (this.users.length > 0) {
			this.userHasJoin = false
		}
	}

	addAvatar(user, callback) {
		var position = new THREE.Vector3(0, 0, 0)
		if (user.mouse) position = user.mouse

		var avatar = new AvatarTHREE(user, position);

		this.avatars[user.id] = avatar;
		this.avatarPlan.add(this.avatars[user.id].mesh);

		avatar.mesh.scale.set(0.01, 0.01, 0.01);
		if (typeof callback == 'function') {
			callback()
		}
	}

	removeUser(userId) {
		this.avatars[userId].scale += (0.01 - this.avatars[userId].scale) * 0.2

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
		if (!user.mouse) {
			user.mouse = new THREE.Vector3(0, 0, 0)
		}

		var avatar = this.avatars[user.id];
		if (!avatar) return;

		if (avatar.scale <= 1) {
			avatar.scale += (1 - avatar.scale) * 0.1

			avatar.mesh.scale.set(
				avatar.scale,
				avatar.scale,
				avatar.scale
			)
		}

		var position = avatar.mesh.position

		if (this.userHasJoin) {
			position.x = user.mouse.x
			position.y = user.mouse.y
			return
		}

		// ADD OFFSET BASED ON this.plan position
		position.x += (user.mouse.x - position.x) * 0.1
		position.y += (user.mouse.y - position.y) * 0.1

	}

	movePlan(data) {
		if (!this.mouseDown) {
			this.plan.rotation.y = data.mouse.x / 10000 + -0.7;
			this.plan.rotation.x = data.mouse.y / 12000 + 0.1;
		}
	}


	setAccomplished(objectId) {
		// WARNING: id from mongodb, not from mesh

		for (var a = 0; a < this.interactions.children.length; a++) {
			var mesh = this.interactions.children[a];

			if (mesh.dbObject._id == objectId) {
				mesh.dbObject.is_finish = true;
				mesh.startAnimation = true;

				break;
			}
		}
	}
	addLight() {

		var al = new THREE.AmbientLight('#fff',0.4);
		SCENE.add(al);

		var light = new THREE.PointLight(0xffffff, 1, 150)
		light.position.set(50, 50, 10);

		var light2 = new THREE.PointLight(0xffffff, 0, 150)
		light2.position.set(-10, 60, 70);

		var light3 = new THREE.PointLight(0xffffff, 0, 150)
		light3.position.set(-40, 40, -30);

		var sphereSize = 1;
		var pointLightHelper = new THREE.PointLightHelper( light3, sphereSize );
		SCENE.add( pointLightHelper );

		this.interactionLights.add(light);
		this.interactionLights.add(light2);
		this.interactionLights.add(light3);
	}

	initLoader() {
		this.loader = {
			tube: function (_this) {


				var vShader = document.querySelector('#vshader');
				var fShader = document.querySelector('#fshader');

				var shaderMaterial =
					new THREE.ShaderMaterial({
						uniforms: _this.uniforms,
						vertexShader: vShader.text,
						fragmentShader: fShader.text
					});


				new Promise(function (resolve) {
					_this.OBJLoader.load(PUBLIC_PATH + '/object/tube2.obj', function (mesh) {
						resolve(mesh);
					});
				})
					.then(function (mesh) {
						mesh.scale.set(_this.size, _this.size, _this.size);
						mesh.position.set(0, 0, 0);
						mesh.rotation.set(0, 0, 0);

						mesh.traverse(function (child) {
							if (child instanceof THREE.Mesh) {
								child.material = shaderMaterial;
							}
						});

						_this.plan.add(mesh);
					});
			},
			room: function (_this, datas) {

				new Promise(function (resolve) {
					_this.OBJLoader.load(PUBLIC_PATH + '/object/rooms/room' + datas.room[0].object + '.obj', function (mesh) {
						resolve(mesh);
					});
				})
					.then(function (mesh) {
						mesh.scale.set(_this.size, _this.size, _this.size);
						mesh.position.set(0, 0, 0);
						mesh.rotation.set(0, 0, 0);
						mesh.traverse(function (child) {
							if (child instanceof THREE.Mesh) {
								child.material = new THREE.MeshPhongMaterial({
									opacity: 1,
									color: '#b6b6b6'
								})
							}
						});
						_this.plan.add(mesh);

					});
			},

			interaction: function (_this, datas) {
				for (var i = 0; i < datas.interactions.length; i++) {
					var inte = datas.interactions[i];

					new Promise(function (resolve) {
						var interaction = inte;
						_this.OBJLoader.load(PUBLIC_PATH + 'object/interactions/' + interaction.type + '.obj', function (mesh) {
							mesh.dbObject = interaction;
							resolve(mesh);
						});
					})
					.then(function (mesh) {
						var interaction = mesh.dbObject;

						mesh.scale.set(_this.size, _this.size, _this.size);
						mesh.position.set(interaction.position.x, interaction.position.y, interaction.position.z);
						mesh.children[0].dbObject = mesh.dbObject;

						switch (interaction.type) {
							case 1:
								mesh.rotation.set(0, 0, 0);
								mesh.name = "block";
								break;
							case 2:
								mesh.rotation.set(Math.PI / 3, 0, 0);
								mesh.name = "wheel";
								break;
							default:
								mesh.rotation.set(0, 0, 0);
								mesh.name = "wheel";
								break;
						}

						mesh.traverse(function (child) {
							if (child instanceof THREE.Mesh) {
								child.material = new THREE.MeshPhongMaterial({
									opacity: 1,
									color: '#eee'
								})
							}
						});

						_this.interactions.add(mesh);
					});
				}
			}
		}
	}


}
