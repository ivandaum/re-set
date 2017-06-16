class InteractionTHREE {
  constructor(mesh,db) {
    this.mesh = mesh;
    this.db = db;
    this.startAnimation = false;
    this.originalPosition = mesh.originalPosition;
  }

  setFinished() {
      switch (this.mesh.name) {
        case "wheel":
          this.mesh.rotation.x = 0;
          this.startAnimation = false;
        break;
        case "block":
          this.mesh.position.y = -9;
          this.startAnimation = false;
        break;
      }
  }

  update(userImpact) {
    for (var i = 0; i < userImpact.length; i++) {
      if (userImpact[i].interactionClicked == this.db._id && userImpact[i].vectorEnd) {
        var userData = userImpact[i];
        //TODO reaction des objets
        switch (this.mesh.name) {
          case "wheel":
            var startVector = new THREE.Vector2(userData.vectorStart.x, userData.vectorStart.y);
            var endVector = new THREE.Vector2(userData.vectorEnd.x, userData.vectorEnd.y);
            var distance = startVector.distanceTo(endVector);
            var direction = new THREE.Vector2();
            direction.subVectors( startVector, endVector ).normalize();
            this.mesh.rotation.x += Math.radians(distance);
            break;
          case "block":
            console.log("block");
            break;
          case "door":
            console.log("door");
            break;
        }
      }
    }


    if(!this.db.is_finish && !this.startAnimation) return;

    switch (this.mesh.name) {
      case "wheel":
        this.mesh.rotation.x += (0 - this.mesh.rotation.x) * 0.1;
        break;
      case "block":
        this.mesh.position.y += (this.originalPosition.y - this.mesh.position.y) * 0.1;

        break;
    }

  }
}
