var RoomApp = function(roomId) {
  SCENE = new THREE.Scene();
  RENDERER = new THREE.WebGLRenderer({antialias:true});

  INITIAL_CAMERA = 150;
  CAMERA = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
  RAY = new THREE.Raycaster();

  RENDERER.setClearColor('#000');
  document.body.appendChild(RENDERER.domElement);
  this.id = roomId;
  this.setCamera()
  this.RoomTHREE = new RoomTHREE();

  new Ajax()
  .get('/room/' + this.id, function() {

  })
}

RoomApp.prototype = {
  render:function() {


    if(!this.RoomTHREE) return

    this.RoomTHREE.update()
  },
  setCamera: function() {
    RENDERER.setSize(window.innerWidth, window.innerHeight);

     CAMERA.position.z = INITIAL_CAMERA
     CAMERA.position.x = 0
     CAMERA.position.y = 2

     CAMERA.lookAt({x:0,y:2,z:0})
  }
}
