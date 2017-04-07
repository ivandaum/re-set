var MapTHREE = function(name) {
  this.plan = new THREE.Object3D();
  this.users = [];
  this.name = name;
  this.rooms = [];
  this.userHasJoin = true;
  this.hoverRoom = null;

  this.roomMaterial = {
    basic: new THREE.MeshLambertMaterial({color:'#ffffff'}),
    hover: new THREE.MeshLambertMaterial({color:'#ff0000'})
  };

  this.roomSize = {
    x:0.2,
    y:0.2,
    z:0.2
  };
  this.citySize = 1;
  CONTROL = new THREE.OrbitControls(CAMERA,RENDERER.domElement);

  SCENE.add(this.plan);
  var Ambient = new THREE.AmbientLight('#eee');
  Ambient.position.set(0,0,0);
  SCENE.add(Ambient);

  var light = new THREE.PointLight('#333',10,100);
  light.position.set(15,15,15);
  SCENE.add(light);

  this.createCity();
};

MapTHREE.prototype = {
  update:function() {

    if(typeof this.rooms == 'undefined') return;

    var room = {};
    for(var e=0; e<this.rooms.length; e++) {
      room = this.rooms[e];

      // create room
      if(typeof room.mesh == 'undefined') {

        room.mesh = this.createRoomPreview(room);
        room.mesh.roomId = room._id;
        this.plan.add(room.mesh);

        var position = this.generateRoomPosition(e);
        room.mesh.position.set(position.x,position.y,position.z);
      }
    }

  },
  createCity: function() {
    var geometry = new THREE.SphereGeometry(
        this.citySize,
        50,
        50
    );

    var material = new THREE.MeshLambertMaterial({color:'#333'});
    material.needsUpdate = true;

    var mesh = new THREE.Mesh(geometry, material);

    this.plan.add(mesh);

    mesh.position = new THREE.Vector3(0,0,0);
  },
  generateRoomPosition: function(e) {
    var count = this.rooms.length;
    var perc = count / 100 * 360;

    var angle = (e*perc)*Math.PI/180;

    var x = Math.cos(angle);
    var y = -this.citySize + 2*(this.citySize/count*e);
    var z = Math.sin(angle);

    return {
      x:x,
      y:y,
      z:z
    }

  },
  makeRoomGlow: function(object) {
    object.material = this.roomMaterial.hover;
    this.hoverRoom = object.roomId;
  },
  normalMaterial: function(object) {
    object.material = this.roomMaterial.basic;
    this.hoverRoom = null;
  },
  createRoomPreview: function() {
    var geometry = new THREE.BoxGeometry(
        this.roomSize.x,
        this.roomSize.y,
        this.roomSize.z
    );

    var material = this.roomMaterial.basic;
    return new THREE.Mesh(geometry, material);
  }
};
