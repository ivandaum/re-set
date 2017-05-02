class RoomTHREE {
	constructor(name) {
		this.plan = new THREE.Object3D()
		this.users = []
		this.avatars = []
		this.name = name
		this.removeUsersArray = []
		this.userHasJoin = true;
		this.mouseDown = false;
		this.lightOn = false;

		SCENE.add(this.plan)
		var al = new THREE.AmbientLight('#eee')
		al.position.set(0, 0, 0)
		SCENE.add(al)

		var l = new THREE.PointLight(0xff0000, 1, 100)
		l.position.set(0, 0, 5)
		SCENE.add(l)

		var m = new THREE.PointLight(0x00ff00, 1, 100)
		m.position.set(0, 0, -50)
		SCENE.add(m)

		var hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.2);
		hemiLight.color.setHSL(0.5, 0.4, 0.6);
		hemiLight.groundColor.setHSL(0.05, 0.5, 0.2);
		hemiLight.position.set(0, 500, 0);
		this.light = hemiLight;

		this.uniforms = {
			whitePath: {
				type: 'f', // a float
				value: 0
			}
		};
		this.count = 0;
		this.countRotation = Math.PI * 1 / 3;
		this.load();

	}

	load() {
		var manager = new THREE.LoadingManager();

		var texture = new THREE.Texture();

		var loader = new THREE.OBJLoader(manager);
		var _this = this;
		var size = 1.2;

		var vShader = document.querySelector('#vshader');
		var fShader = document.querySelector('#fshader');

		var shaderMaterial =
			new THREE.ShaderMaterial({
				uniforms: this.uniforms,
				vertexShader: vShader.text,
				fragmentShader: fShader.text
			});

		this.movingPlan = new THREE.Object3D()

		loader.load('./public/object/decor.obj', function (mesh) {
			mesh.scale.set(size, size, size);
			mesh.position.set(0, 0, 0);
			mesh.rotation.set(0, 0, 0);

			mesh.traverse(function (child) {
				if (child instanceof THREE.Mesh) {
					child.material = new THREE.MeshPhongMaterial({
						opacity: 0.3,
						color: '#b6b6b6'
					})
				}
			});
			_this.movingPlan.add(mesh);
		});

		loader.load('./public/object/interact1.obj', function (mesh) {
			mesh.scale.set(size, size, size);
			mesh.position.set(0, 0, 0);
			mesh.rotation.set(0, 0, 0);

			mesh.traverse(function (child) {
				if (child instanceof THREE.Mesh) {
					child.material = new THREE.MeshPhongMaterial({
						opacity: 0.3,
						color: '#e1e1e1'
					})
				}
			});
			mesh.children[0].draggable = "block";
			_this.interact1 = mesh;
			_this.movingPlan.add(mesh);
		});

		loader.load('./public/object/interact2Centre.obj', function (mesh) {
			mesh.scale.set(size, size, size);
			mesh.position.set(0, 35, -20);
			mesh.rotation.set(Math.PI / 3, 0, 0);
			mesh.traverse(function (child) {
				if (child instanceof THREE.Mesh) {
					child.material = new THREE.MeshPhongMaterial({
						opacity: 0.3,
						color: '#8C82FC'
					})
				}
			});
			mesh.children[0].draggable = "roue";
			mesh.children[0].startRotate = false;
			_this.interact2 = mesh;
			_this.movingPlan.add(mesh);
		});

		loader.load('./public/object/tube2.obj', function (mesh) {
			mesh.scale.set(size, size, size);
			mesh.position.set(0, 0, 0);
			mesh.rotation.set(0, 0, 0);

			mesh.traverse(function (child) {
				if (child instanceof THREE.Mesh) {
					child.material = shaderMaterial;
				}
			});
			_this.movingPlan.add(mesh);
		});
		this.movingPlan.position.set(0, -25, -20);
		this.movingPlan.rotation.set(0.1, -0.7, 0);
		_this.plan.add(_this.movingPlan);

		this.uniforms.whitePath.value = 0.33;
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

		var avatar = new AvatarTHREE(user, position)

		this.avatars[user.id] = avatar
		this.plan.add(this.avatars[user.id].mesh)

		avatar.mesh.scale.set(0.01, 0.01, 0.01)
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
		if (!avatar) return

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
		position.x += (user.mouse.x - position.x) * 0.1
		position.y += (user.mouse.y - position.y) * 0.1
	}

	movePlan(data) {
		if (!this.mouseDown) {
			this.movingPlan.rotation.y = data.mouse.x / 2000 + -0.7;
			this.movingPlan.rotation.x = data.mouse.y / 2500 + 0.1;
		}
	}
}