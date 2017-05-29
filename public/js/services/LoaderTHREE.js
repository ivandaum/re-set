class LoaderTHREE {
    constructor(datas,uniforms) {
        var manager = new THREE.LoadingManager();
        var texture = new THREE.Texture();
        this.OBJLoader = new THREE.OBJLoader(manager);
        this.size = 1.2;
        this.datas = datas;

        this.uniforms = uniforms;
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

          APP.ThreeEntity.tube = new TubeTHREE(mesh);
          APP.ThreeEntity.plan.add(mesh);
        });
    }
    room() {
      var datas = this.datas;
      var _this = this;
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
          APP.ThreeEntity.plan.add(mesh);

        });
    }

    interaction() {
      var _this = this;
      for (var i = 0; i < this.datas.interactions.length; i++) {
        var inte = this.datas.interactions[i];

        new Promise(function (resolve) {
            var interaction = inte;
            _this.OBJLoader.load(PUBLIC_PATH + 'object/interactions/' + interaction.type + '.obj', function (mesh) {
            mesh.dbObject = interaction;
            mesh.dbObject.is_finish = false; // TODO: REMOVE BEFORE PUSH
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
