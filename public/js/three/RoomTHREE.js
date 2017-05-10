class RoomTHREE {
	constructor(loadDatas) {
		this.plan = new THREE.Object3D();
		this.interactions = new THREE.Group();

		this.mouseDown = false;
		this.users = [];
		this.avatars = [];
		this.removeUsersArray = [];
		this.userHasJoin = true;
		this.meshArray = [];

		this.count = 0;
		this.countRotation = Math.PI * 1 / 3;

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
		SCENE.add(this.plan);
	}

	update() {
		var _this = this;

		if (_this.interact2 && _this.interact2.children[0].startRotate) {
			this.countRotation -= 0.01;
			this.interact2.rotation.x = this.countRotation;
			if (this.countRotation < 0) {
				this.interact2.children[0].startRotate = false;
				this.count = 0;
				_this.firstStep = true;
			}
		}

		if (_this.firstStep && this.uniforms.whitePath.value < 0.6) {
			this.count += 0.0001;
			this.uniforms.whitePath.value += Math.sin(this.count);
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
		this.plan.add(this.avatars[user.id].mesh);

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
		position.x += ((user.mouse.x - this.plan.position.x) - position.x) * 0.1
		position.y += ((user.mouse.y - this.plan.position.y) - position.y) * 0.1

	}

	movePlan(data) {
		if (!this.mouseDown) {
			this.plan.rotation.y = data.mouse.x / 10000 + -0.7;
			this.plan.rotation.x = data.mouse.y / 12000 + 0.1;
		}
	}


	setAccomplished(objectId) {
		// WARNING: id from mongodb, not from mesh

		for (var a = 0; a < this.meshArray.length; a++) {

			var mesh = this.meshArray[a];
			if (mesh.dbObject._id == objectId) {
				mesh.dbObject.is_finish = true;

				// TODO : animate front because interaction is complete
				break;
			}
		}
	}
	addLight() {
		SCENE.add(this.plan);
		var al = new THREE.AmbientLight('#fff',0.1);
		al.position.set(0, 0, 0);
		SCENE.add(al);

		var l = new THREE.PointLight(0xffffff, 1, 100)
		l.position.set(0, 50, 5);
		SCENE.add(l);

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
								mesh.children[0].draggable = "block";
								break;
							case 2:
								mesh.rotation.set(Math.PI / 3, 0, 0);
								mesh.children[0].draggable = "wheel";
								break;
							default:
								mesh.rotation.set(0, 0, 0);
								mesh.children[0].draggable = "block";
								break;
						}

						if (interaction.is_finish) {
							switch (interaction.type) {
								case 1:
									mesh.position.y -= 10;
									break;
								case 2:
									mesh.rotation.set(0, 0, 0);
									break;
								default:
									mesh.position.y -= 10;
									break;
							}
						}

						mesh.traverse(function (child) {
							if (child instanceof THREE.Mesh) {
								child.material = new THREE.MeshPhongMaterial({
									opacity: 1,
									color: '#333'
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
