var SCENE,RENDERER,INITIAL_CAMERA,CAMERA,RAY,MOUSE,ROOM,RENDER_LIST = [];

var App = function() {
  SCENE = new THREE.Scene()
  RENDERER = new THREE.WebGLRenderer()
  INITIAL_CAMERA = 150
  CAMERA = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 )
  RAY = new THREE.Raycaster();
  MOUSE = new THREE.Vector3(0,0,0)

  this.user = new userSocket()

  RENDERER.setClearColor('#000');
  document.body.appendChild(RENDERER.domElement);

  return this
}

App.prototype.render = function() {

}

App.prototype.joinRoom = function(name) {
  this.user.joinRoom(name)
}
