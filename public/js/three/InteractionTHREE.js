class InteractionTHREE {
  constructor(mesh,db) {
    this.mesh = mesh;
    this.db = db;
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
        break;
        case "block":
          this.mesh.position.y = -9;
        break;
      }
  }

  update(userImpact) {
    if(!this.db.is_finish) {
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
                this.max = (-this.mesh.originalRotation / (this.db.people_required - userImpact.length + 1));
                if (this.globalDirection.y < 0) {
                  if (this.globalDirection.x < 0) {
                    if (this.mesh.rotation.x <= Math.radians(-0.5) && this.mesh.rotation.x < (this.max - Math.radians(180))) {
                        this.mesh.rotation.x += Math.radians(this.distance/10);
                    }
                  } else {
                    if (this.mesh.rotation.x > Math.radians(-359.5) && this.mesh.rotation.x > -(this.max + Math.radians(180))) {
                        this.mesh.rotation.x -= Math.radians(this.distance/10);
                    }
                  }
                }
                break;
              case "block":
                if (this.globalDirection.y > 0) {
                  this.max = (this.db.position.y - 25) / (this.db.people_required - userImpact.length + 1);
                  if (this.direction.y > 0 && this.mesh.position.y <= this.db.position.y && this.mesh.position.y <= (this.max+25)) {
                      this.mesh.position.y += this.distance/100;
                  }
                  if (this.direction.y < 0 && this.mesh.position.y >= 0) {
                      this.mesh.position.y -= this.distance/100;
                  }
                }
                break;
              case "door":
                this.mesh.children[1].position.x -= 0.2;
                console.log(this.mesh.children[1].position.x, userData.vectorStart.x);
                break;
            }
          }

        //si le user relache
          if (userData.stopClick) {
            switch (this.mesh.name) {
              case "wheel":
                if (this.mesh.rotation.x >= Math.radians(-179.5)) {
                    this.mesh.rotation.x -= Math.radians(1);
                }
                if (this.mesh.rotation.x <= Math.radians(-179.5) && this.mesh.rotation.x >= Math.radians(-180.5)) {
                  APP.ThreeEntity.usersVectors.splice(i, 1);
                }
                if (this.mesh.rotation.x <= Math.radians(-180.5)) {
                    this.mesh.rotation.x += Math.radians(1);
                }
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
                APP.ThreeEntity.usersVectors.splice(i, 1);
                break;
            }
          }
        }
      }

      // check if interaction is finished
      switch (this.mesh.name) {
        case "wheel":
          if (this.mesh.rotation.x >= Math.radians(-0.5) || this.mesh.rotation.x <= Math.radians(-359.5)) {
            this.validateInteraction(userData.user.id, i);
            // TODO : faire une petite animation
          }
          break;
        case "block":
          if (this.mesh.position.y >= this.db.position.y) {
            this.validateInteraction(userData.user.id, i);
            // TODO : faire une petite animation
          }
          break;
        case "door":
          //console.log("door");
          break;

      }


    } else {
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

  validateInteraction(id, index) {
    USER.usersFinishedInteraction(this.db._id);
    // TODO : desactiver la possibilité d'interagir avec l'objet
  }

}
