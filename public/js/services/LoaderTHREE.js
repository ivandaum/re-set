class LoaderTHREE {
    constructor() {
        var manager = new THREE.LoadingManager();
        var texture = new THREE.Texture();
        this.OBJLoader = new THREE.OBJLoader(manager);
		this.textureLoader = new THREE.TextureLoader();
        this.size = 1.2;
    }

    setDatas(datas,uniforms) {
	    this.datas = datas;
	    this.uniforms = uniforms;
    }

	home() {
		var _this = this;
		var object = new Promise(function(resolve) {
			_this.OBJLoader.load(PUBLIC_PATH + '/object/home.obj',function(mesh) {
				resolve(mesh);
			})
		});

		var texture = new Promise(resolve => {
			_this.textureLoader.load( PUBLIC_PATH + "images/stone.jpg", mapHeight => {
				mapHeight.anisotropy = 0;
				mapHeight.repeat.set( 5, 5 );
				mapHeight.offset.set( 0.001, 0.001 );
				mapHeight.wrapS = mapHeight.wrapT = THREE.RepeatWrapping;
				resolve(mapHeight);
			});
		});

		Promise.all([object, texture])
			.then((values) => {
				var letters = [
					'RESET_R_1',
					'RESET_E_1',
					'RESET_S_1',
					'RESET_E_2',
					'RESET_T_1'
				];

				let mesh = values[0];
				let mapHeight = values[1];
				mesh.scale.set(0.2,0.2,0.2);
				mesh.position.set(0, -20, 0);
				mesh.rotation.set(0, 0, 0);

				mesh.traverse(function (child) {
					if (child instanceof THREE.Mesh) {
						var color = "#fff";
						if(child.name == 'prisme') {
							color = "#1e1e21";
						}

						let material = null;

						if(child.name == 'TROUDYVAN') {
							material = new THREE.MeshBasicMaterial({
								color: color
							});
						} else {
							material = new THREE.MeshPhongMaterial({
								opacity: 1,
								color: color,
								shininess: 20,
								specular: '#fff',
								map: mapHeight,
								bumpMap: mapHeight,
								bumpScale  :  0.1
							});

						}
						child.material = material;

						// child.castShadow = true;
						// child.receiveShadow = true;
					}
				});
				APP.ThreeEntity.plan.add(mesh);
			});
	}

	map() {
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

					if(notNull(APP.ThreeEntity.rooms[index])) {
						child.material = new THREE.MeshLambertMaterial({
							color: '#242424',
							opacity:1
						});
						child.roomId = APP.ThreeEntity.rooms[index]._id;
						APP.ThreeEntity.rooms[index].mesh = child;
					}
					index++;
				}
			});
			APP.ThreeEntity.map = mesh;
            APP.ThreeEntity.map.position.y = -50;
			SCENE.add(APP.ThreeEntity.map);
		});
	}

	button() {
		var _this = this;
		new Promise(function (resolve) {
			_this.OBJLoader.load(PUBLIC_PATH + '/object/button.obj', function (mesh) {
				resolve(mesh);
			});
		})
			.then(function (mesh) {
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
				APP.ThreeEntity.button = new ButtonTHREE(mesh);
				APP.ThreeEntity.plan.add(mesh);
			});
	}

	studio() {
		var _this = this;
		new Promise(function (resolve) {
			_this.OBJLoader.load(PUBLIC_PATH + '/object/studio.obj', function (mesh) {
				resolve(mesh);
			});
		})
			.then(function (mesh) {
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
				APP.ThreeEntity.studio = mesh;
				APP.ThreeEntity.studio.rotation.set(0, -Math.radians(55), 0);
				SCENE.add(APP.ThreeEntity.studio);
			});
	}

    tube() {
      var datas = this.datas;
      var _this = this;
      var vShader = document.querySelector('#vshader');
      var fShader = document.querySelector('#fshader');

      var shaderMaterial =
        new THREE.ShaderMaterial({
          uniforms: _this.uniforms,
          vertexShader: vShader.text,
          fragmentShader: fShader.text
        });


      new Promise(function (resolve) {
        _this.OBJLoader.load(PUBLIC_PATH + '/object/tubes/tube' + datas.room[0].object + '.obj', function (mesh) {
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

          APP.ThreeEntity.tube = new TubeTHREE(mesh);
          APP.ThreeEntity.plan.add(mesh);
        });
    }
    room() {
      var datas = this.datas;
      var _this = this;
      var p1 = new Promise(function (resolve) {
        _this.OBJLoader.load(PUBLIC_PATH + '/object/rooms/room' + datas.room[0].object + '.obj', function (mesh) {
          resolve(mesh);
        });
      });

	  var p2 = new Promise(resolve => {
		_this.textureLoader.load( PUBLIC_PATH + "images/stone.jpg", mapHeight => {
			mapHeight.anisotropy = 0;
			mapHeight.repeat.set( 3, 3 );
			mapHeight.offset.set( 0.001, 0.001 );
			mapHeight.wrapS = mapHeight.wrapT = THREE.RepeatWrapping;
			resolve(mapHeight);
		});
	  });

	  Promise.all([p1, p2])
        .then((values) => {
			let mesh = values[0];
			let mapHeight = values[1];
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
				map: mapHeight,
				//bumpMap: mapHeight,
				bumpScale  :  0.3
              });

			  child.castShadow = true;
			  child.receiveShadow = true;
            }
          });
          APP.ThreeEntity.plan.add(mesh);
        });
    }

    interaction() {
      var _this = this;
      for (var i = 0; i < this.datas.interactions.length; i++) {
        var inte = this.datas.interactions[i];

        var p1 = new Promise(function (resolve) {
            var interaction = inte;
            _this.OBJLoader.load(PUBLIC_PATH + 'object/obstacles/' + interaction.type + '.obj', function (mesh) {
            mesh.dbObject = interaction;
            resolve(mesh);
          });
        })
		var p2 = new Promise(resolve => {
			var img = new Image();
	        img.onload = function(){

	            var envMap = new THREE.Texture( img );
	            envMap.mapping = THREE.SphericalReflectionMapping;
	            envMap.format = THREE.RGBFormat;
	            envMap.needsUpdate = true;

				resolve(envMap);
	        }

	        img.src = PUBLIC_PATH + 'images/metal.jpg';
  		});
	  Promise.all([p1, p2])
		.then((values) => {
		  var mesh = values[0];
          var interaction = mesh.dbObject;

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
				envMap: values[1]
              })
            }
          });

          APP.ThreeEntity.plan.add(mesh);
          APP.ThreeEntity.interactions.push(new InteractionTHREE(mesh));

          // If model already finish on loading, set it to finish
          // and update global tube progression
          if(mesh.dbObject.is_finish) {

            if(mesh.dbObject.percent_progression > APP.ThreeEntity.percentAccomplished) {
              APP.ThreeEntity.percentAccomplished += mesh.dbObject.percent_progression;
            }

            var n = APP.ThreeEntity.interactions.length -1;
            APP.ThreeEntity.interactions[n].setFinished();
          }
        });
      }
    }
}
