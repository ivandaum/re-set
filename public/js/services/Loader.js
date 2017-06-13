class Loader {
	constructor() {
		this.db = {
			interactions: [],
			rooms: []
		};

		this.mesh = {
			map: {},
			rooms: {},
			interactions: {},
			mapRooms: {},
			helpButton: {},
			tubes: {},
			studio: {}
		};

		this.toLoad = {
			total:0,
			current:0
		};

		this.percent = 0;

		var manager = new THREE.LoadingManager();
		this.OBJLoader = new THREE.OBJLoader(manager);
		this.textureLoader = new THREE.TextureLoader();

		this.loadAllFromDb();
		this.loadHelpButton();
		this.loadStudio();


		var _this = this;

		// Load map only at the end
		this.loading = setInterval(function() {
			console.log(_this.percent + '%');
			_this.percent = Math.floor(_this.toLoad.current/_this.toLoad.total * 100);

			if(_this.toLoad.current == _this.toLoad.total) {
				clearInterval(_this.loading);
				_this.loadMap(function() {
					_this.percent = 100;
					console.log('all loaded');
				});
			}
		},500);
	}

	getRoom(name) {

		let room = {
			db: null,
			mesh: null
		};

		for(let a=0; a<this.db.rooms.length; a++) {
			if(this.db.rooms[a]._id == name) {
				room.db = this.db.rooms[a];
				room.mesh = this.mesh.rooms[this.db.rooms[a].object];
				return room;
			}
		}

		return false;
	}

	loadAllFromDb() {
		var _this = this;

		let rooms = new Promise(resolve => {
			Ajax.get('/api/rooms', function (data) {
				resolve(JSON.parse(data));
			});
		});

		let interactions = new Promise(resolve => {
			Ajax.get('/api/interactions', function (data) {
				resolve(JSON.parse(data));
			});
		});

		Promise.all([rooms,interactions]).then((values) => {
			let rooms = values[0].rooms;
			let interactions = values[1].interactions;

			// LIST OF OBJECT REQUIRED PLZ : room*2 because counting tube

			_this.toLoad.total += (rooms.length*2) + interactions.length;

			for(let ind =0; ind < rooms.length; ind++) {
				var room = rooms[ind];
				_this.db.rooms[ind] = room;
				_this.loadRoom(room.object);
				_this.loadTube(room.object);
			}

			for(let ind =0; ind < interactions.length; ind++) {
				var interaction = interactions[ind];
				_this.db.interactions[ind] = interaction;
				_this.loadInteraction(interaction);
			}
		});
	}
	loadTube(number) {
		var _this = this;
		var vShader = document.querySelector('#vshader');
		var fShader = document.querySelector('#fshader');

		if(notNull(_this.mesh.tubes[number])) {
			_this.toLoad.current++;
			return;
		}

		_this.mesh.tubes[number] = true;

		var shaderMaterial =
			new THREE.ShaderMaterial({
				uniforms: _this.uniforms,
				vertexShader: vShader.text,
				fragmentShader: fShader.text
			});


		new Promise(resolve => {
			_this.OBJLoader.load(PUBLIC_PATH + '/object/tubes/tube' + number + '.obj', function (mesh) {
				resolve(mesh);
			});
		})
		.then(mesh => {
			mesh.scale.set(_this.size, _this.size, _this.size);
			mesh.position.set(0, 0, 0);
			mesh.rotation.set(0, 0, 0);

			mesh.traverse(function (child) {
				if (child instanceof THREE.Mesh) {
					child.material = shaderMaterial;
				}
			});

			_this.mesh.tubes[number] = mesh;
			_this.toLoad.current++;
		});
	}
	loadStudio() {
		var _this = this;
		_this.toLoad.total++;
		new Promise(resolve => {
			_this.OBJLoader.load(PUBLIC_PATH + '/object/studio.obj', function (mesh) {
				resolve(mesh);
			});
		})
			.then(mesh => {
				mesh.scale.set(_this.size, _this.size, _this.size);
				mesh.position.set(0, 15, -150);
				mesh.rotation.set(0, 0, 0);
				mesh.traverse(function (child) {
					if (child instanceof THREE.Mesh) {
						child.material = new THREE.MeshPhongMaterial({
							opacity: 1,
							color: '#FFFFFF'
						});
					}
				});
				_this.mesh.studio = mesh;
				_this.toLoad.current++;
			});
	}
	loadHelpButton() {
		var _this = this;
		_this.toLoad.total++;

		new Promise(resolve => {
			_this.OBJLoader.load(PUBLIC_PATH + '/object/button.obj', function (mesh) {
				resolve(mesh);
			});
		})
		.then(mesh => {
			mesh.scale.set(_this.size, _this.size, _this.size);
			mesh.position.set(0, 0, 0);
			mesh.rotation.set(0, 0, 0);
			mesh.traverse(function (child) {
				if (child instanceof THREE.Mesh) {
					if (child.name != 'bouton_on_Cylindre') {
						child.material = new THREE.MeshBasicMaterial({
							opacity: 1,
							color: '#000'
						});
					} else {
						child.material = new THREE.MeshLambertMaterial({
							opacity: 1,
							color: '#fff'
						});
					}
				}
			});
			_this.mesh.helpButton = mesh;
			_this.toLoad.current++;
		});
	}

	loadInteraction(interaction) {
		var _this = this;

		if(notNull(_this.mesh.rooms[interaction.type])) {
			_this.toLoad.current++;
			return;
		}
		_this.mesh.interactions[interaction.type] = true;

		new Promise(resolve => {
			_this.OBJLoader.load(PUBLIC_PATH + 'object/obstacles/' + interaction.type + '.obj', function (mesh) {
				resolve(mesh);
			});
		})
		.then(mesh => {

			mesh.originalPosition = interaction.position;
			mesh.scale.set(_this.size, _this.size, _this.size);
			mesh.position.set(interaction.position.x, interaction.position.y, interaction.position.z);
			mesh.children[0].dbObject = mesh.dbObject;

			switch (interaction.type) {
				case 1:
					mesh.position.y -= 9;
					mesh.name = "block";
					break;
				case 2:
					mesh.rotation.set(Math.radians(-180), 0, 0);
					mesh.name = "wheel";
					break;
				case 3:
					mesh.name = "door";
					break;
				default:
					mesh.rotation.set(0, 0, 0);
					mesh.name = "block";
					break;
			}

			mesh.traverse(function (child) {
				if (child instanceof THREE.Mesh) {
					child.material = new THREE.MeshStandardMaterial({
						metalness: 1.2,
						roughness:0.5,
						color: '#ffffff',
					})
				}
			});

			_this.mesh.interactions[interaction.type] = mesh;
			_this.toLoad.current++;
		});

	}

	loadRoom(number) {
		var _this = this;

		// If object already loaded, skip mesh loading and
		// specified to loader that object is already loaded
		if(notNull(_this.mesh.rooms[number])) {
			_this.toLoad.current++;
			return;
		}

		// Prevent loading lot of time the same object
		_this.mesh.rooms[number] = true;

		new Promise(resolve => {
			_this.OBJLoader.load(PUBLIC_PATH + 'object/rooms/room' + number + '.obj', function (mesh) {
				resolve(mesh,number);
			});
		}).then((mesh) => {
			mesh.scale.set(_this.size, _this.size, _this.size);
			mesh.position.set(0, 0, 0);
			mesh.rotation.set(0, 0, 0);

			mesh.traverse(function (child) {
				if (child instanceof THREE.Mesh) {
					child.material = new THREE.MeshPhysicalMaterial({
						opacity: 1,
						color: '#262626',
						shading: THREE.SmoothShading,
						clearCoat: 5,
						reflectivity:1,
						clearCoatRoughness: 1,
						bumpScale  :  0.3
					});

					child.castShadow = true;
					child.receiveShadow = true;
				}
			});

			_this.mesh.rooms[number] = mesh;
			_this.toLoad.current++;
		});
	}

	loadMap(callback) {
		var _this = this;
		new Promise(function (resolve) {
			_this.OBJLoader.load(PUBLIC_PATH + '/object/map.obj', function (mesh) {
				resolve(mesh);
			});
		})
		.then(function (mesh) {
			let easeDist = 0;
			let index = 0;

			mesh.traverse(function (child) {
				if (child instanceof THREE.Mesh) {
					child.material = new THREE.MeshLambertMaterial({
						color: '#121212',
						opacity:0.5
					});
					child.geometry.computeBoundingBox();
					child.name = "room";

					const boundingBox = child.geometry.boundingBox;

					let position = new THREE.Vector3();
					position.subVectors( boundingBox.max, boundingBox.min );
					position.multiplyScalar( 0.5 );
					position.add( boundingBox.min );

					position.applyMatrix4( child.matrixWorld );

					let distance = (Math.random()) * easeDist;
					easeDist += 0.003;

					let newPos = new THREE.Vector3();
					newPos.addVectors(child.position, position.multiplyScalar( distance ))

					child.position.set(newPos.x, newPos.y, newPos.z);

					if(notNull(LOADER.db.rooms[index])) {
						child.material = new THREE.MeshLambertMaterial({
							color: '#242424',
							opacity:1
						});
						child.roomId = LOADER.db.rooms[index]._id;
						LOADER.mesh.mapRooms[index] = child;
					}
					index++;
				}
			});

			LOADER.mesh.map = mesh;
			if(typeof callback == 'function') {
				callback();
			}

		});
	}
}