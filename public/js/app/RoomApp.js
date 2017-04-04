var RoomApp = function() {
  SCENE = new THREE.Scene()
  RENDERER = new THREE.WebGLRenderer({antialias:true})

  INITIAL_CAMERA = 150
  CAMERA = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 )
  RAY = new THREE.Raycaster();

  RENDERER.setClearColor('#000');
  document.body.appendChild(RENDERER.domElement);

  this.setCamera()
}

RoomApp.prototype = {
  render:function() {

    if(!this.user) return
    if(!this.user.room) return

    this.user.room.update()
  },
  enterRoom: function(name) {
    this.user.joinRoom(name)
  },
  setCamera: function() {
    RENDERER.setSize(window.innerWidth, window.innerHeight);

     CAMERA.position.z = INITIAL_CAMERA
     CAMERA.position.x = 0
     CAMERA.position.y = 2

     CAMERA.lookAt({x:0,y:2,z:0})
  }
}
