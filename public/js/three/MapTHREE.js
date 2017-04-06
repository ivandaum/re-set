var MapTHREE = function(name) {
  this.plan = new THREE.Object3D();
  this.users = [];
  this.name = name;
  this.rooms = [];
  this.userHasJoin = true;
  this.roomSize = {
    x:0.5,
    y:0.5,
    z:0.5
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

  // this.createCity();
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
        this.plan.add(room.mesh);

        room.mesh.position = this.generateRoomPosition(e);

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
    var mesh = new THREE.Mesh(geometry, material);

    this.plan.add(mesh);

    mesh.position = new THREE.Vector3(0,0,0);
  },
  generateRoomPosition: function(e) {
    var angle = e*Math.PI/180
    var x = Math.cos(angle);
    var y = Math.sin(angle);
    var z = Math.tan(angle);

    return new THREE.Vector3(x,y,z);

  },
  createRoomPreview: function() {
    var geometry = new THREE.BoxGeometry(
        this.roomSize.x,
        this.roomSize.y,
        this.roomSize.z
    );

    var material = new THREE.MeshLambertMaterial({color:'#ff0000'});
    return new THREE.Mesh(geometry, material);
  }
};
