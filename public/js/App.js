var SCENE,RENDERER,INITIAL_CAMERA,CAMERA,RAY,RENDER_LIST = [];

var App = function() {
  SCENE = new THREE.Scene()
  RENDERER = new THREE.WebGLRenderer()

  INITIAL_CAMERA = 150
  CAMERA = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 )
  RAY = new THREE.Raycaster();

  this.user = new userSocket()

  // var controls = new THREE.OrbitControls(CAMERA,RENDERER.domElement)
  RENDERER.setClearColor('#000');
  document.body.appendChild(RENDERER.domElement);

  this.setCamera()
  // this.debug()
}

App.prototype.render = function() {

  if(!this.user) return
  if(!this.user.room) return

  this.user.room.update()
}

App.prototype.joinRoom = function(name) {
  this.user.joinRoom(name)
}

App.prototype.debug = function() {
  var min = 1
  var max = 150

  var axis = {
    x: new THREE.Mesh(new THREE.BoxGeometry(max,min,min), new THREE.MeshBasicMaterial({color: '#ff0000'})),
    y: new THREE.Mesh(new THREE.BoxGeometry(min,max,min), new THREE.MeshBasicMaterial({color: '#00ff00'})),
    z: new THREE.Mesh(new THREE.BoxGeometry(min,min,max), new THREE.MeshBasicMaterial({color: '#0000ff'})),
  }

  axis.x.position.x = max / 2
  axis.x.position.y = min / 2
  axis.x.position.z = min / 2

  axis.y.position.x = min / 2
  axis.y.position.y = max / 2
  axis.y.position.z = min / 2

  axis.z.position.x = min / 2
  axis.z.position.y = min / 2
  axis.z.position.z = max / 2

  SCENE.add(axis.x)
  SCENE.add(axis.y)
  SCENE.add(axis.z)
}

App.prototype.setCamera = function() {
  RENDERER.setSize(window.innerWidth, window.innerHeight);

   CAMERA.position.z = INITIAL_CAMERA
   CAMERA.position.x = 0
   CAMERA.position.y = 2

   CAMERA.lookAt({x:0,y:2,z:0})
}
