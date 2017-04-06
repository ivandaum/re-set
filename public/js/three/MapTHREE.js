var MapTHREE = function(name) {
  this.plan = new THREE.Object3D()
  this.users = [];
  this.avatars = [];
  this.name = name;
  this.removeUsersArray = [];
  this.userHasJoin = true;

  SCENE.add(this.plan)
  var al = new THREE.AmbientLight('#eee');
  al.position.set(0,0,0);
  SCENE.add(al);

  var l = new THREE.PointLight('#fff',10,100);
  l.position.set(0,0,5);
  SCENE.add(l)
};

MapTHREE.prototype = {
  update:function() {

  }
};
