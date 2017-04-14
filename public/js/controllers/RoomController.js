var RoomController = function(roomId) {
  SCENE = new THREE.Scene();
  RENDERER = new THREE.WebGLRenderer({antialias:true});

  INITIAL_CAMERA = 150;
  CAMERA = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
  RAY = new THREE.Raycaster();

  RENDERER.setClearColor('#000');

  document.querySelector('#canvas-container').innerHTML = "";
  document.querySelector('#canvas-container').appendChild(RENDERER.domElement);

  this.id = roomId;
  this.setCamera();
  this.RoomTHREE = new RoomTHREE();

  return this;
};

RoomController.prototype = {
  render:function() {

    if(!this.RoomTHREE) return

    this.RoomTHREE.update()
  },
  roomRaycaster: function(mouse) {

	  var childrens = SCENE.children[0].children[0].children;

	  RAY.setFromCamera( mouse.sub( CAMERA.position ).normalize() , CAMERA );

		var intersects = RAY.intersectObjects( childrens, true );

		console.log(intersects);

		if (intersects.length > 0) {
			for (var i = 0; i < intersects.length; i++) {
				if (intersects[i].object.draggable) {
					console.log(intersects[i], intersects[i].object);
					switch (intersects[i].object.draggable) {
						case "roue":
							intersects[i].object.startRotate = true;
							break;
						case "block":
							console.log("block");
							break;
					}
				}
				break;
			}
		}

  },
  setCamera: function() {
    RENDERER.setSize(window.innerWidth, window.innerHeight);

    CAMERA.position.z = INITIAL_CAMERA;
    CAMERA.position.x = 0;
    CAMERA.position.y = 2;
    CAMERA.lookAt({x:0,y:2,z:0})
  }
}
