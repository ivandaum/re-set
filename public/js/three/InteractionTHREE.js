class InteractionTHREE {
  constructor(mesh,db) {
    this.mesh = mesh;
    this.db = db;
    this.startAnimation = false;
    this.originalPosition = mesh.originalPosition;
    this.startVector = new THREE.Vector2();
    this.endVector = new THREE.Vector2();
    this.oldVectorEnd = new THREE.Vector2();
    this.distance = 0;
    this.direction = new THREE.Vector2();
    this.globalDirection = new THREE.Vector2();
    this.max = 0;
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
      var userData = userImpact[i];
      if (userData.oldVectorEnd && userData.interactionClicked == this.db._id) {

        //traitement du vecteur
        this.startVector.set(userData.vectorStart.x, userData.vectorStart.y);
        this.endVector.set(userData.vectorEnd.x, userData.vectorEnd.y);
        this.oldVectorEnd.set(userData.oldVectorEnd.x, userData.oldVectorEnd.y);
        this.distance = this.startVector.distanceTo(this.endVector);
        this.direction.subVectors( this.endVector, this.oldVectorEnd ).normalize();
        this.globalDirection.subVectors( this.endVector, this.startVector ).normalize();

        //si le user est en mouse move
        if (!userData.stopClick && this.oldVectorEnd.distanceTo(this.endVector) > 0.12) {
          switch (this.mesh.name) {
            case "wheel":
              this.mesh.rotation.x += Math.radians(this.distance);
              break;
            case "block":
              if (this.globalDirection.y > 0) {
                this.max = (this.db.position.y - 25) / (this.db.people_required - userImpact.length + 1);
                console.log(this.max);
                if (this.direction.y > 0 && this.mesh.position.y <= this.db.position.y && this.mesh.position.y <= (this.max+25)) {
                    this.mesh.position.y += this.distance/100;
                }
                if (this.direction.y < 0 && this.mesh.position.y >= 0) {
                    this.mesh.position.y -= this.distance/1000;
                }
                if (this.mesh.position.y >= this.db.position.y) {
                  console.log(userData);
                  APP.ThreeEntity.removeVectorsDraw(userData.user.id);
                  APP.ThreeEntity.usersVectors.splice(i, 1);
                  USER.usersFinishedInteraction(this.db._id);
                  // TODO : desactiver la possibilité d'interagir avec l'objet
                  // TODO : faire une petite animation
                }
              }
              break;
            case "door":
              console.log("door");
              break;
          }
        }

        //si le user relache
        if (userData.stopClick) {
          APP.ThreeEntity.usersVectors[i].vectorEnd.x -= 1;
          APP.ThreeEntity.usersVectors[i].vectorEnd.y -= 1;
          switch (this.mesh.name) {
            case "wheel":
              console.log('wheel back');
              break;
            case "block":
            if (this.mesh.position.y >= 25) {
                this.mesh.position.y -= this.distance/100;
            }
            if (this.mesh.position.y <= 25 && this.mesh.position.y > 24) {
              APP.ThreeEntity.usersVectors.splice(i, 1);
            }
            if (this.mesh.position.y < 24) {
                this.mesh.position.y += this.distance/100;
            }
              break;
            case "door":
              console.log("door back");
              break;
          }
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
