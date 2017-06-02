class InteractionTHREE {
  constructor(mesh,dbObject) {
    this.mesh = mesh;
    this.db = mesh.dbObject;
    this.startAnimation = false;
  }

  setFinished() {
      switch (this.mesh.name) {
        case "wheel":
          this.mesh.rotation.x = 0;
          this.startAnimation = false;
        break;
        case "block":
          this.mesh.position.y = -9
          this.startAnimation = false;
        break;
      }
  }

  update() {

    if(!this.db.is_finish && !this.startAnimation) return;

    switch (this.mesh.name) {
      case "wheel":
        this.mesh.rotation.x += (0.000001 - this.mesh.rotation.x) * 0.03;

        break;
      case "block":
        this.mesh.position.y += (-9 - this.mesh.position.y) * 0.1;

        break;
    }

  }
}
