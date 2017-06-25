class ButtonTHREE {
  constructor(mesh) {
    this.mesh = mesh;
    this.count = 0;
    this.activeMaterial = new THREE.MeshBasicMaterial( { color: 0xff6a00, opacity: 1} );
    this.inactiveMaterial = new THREE.MeshLambertMaterial({
      opacity: 1,
      color: '#fff'
    });

    this.helpLight = new THREE.PointLight( 0xff6a00, 0, 10 );
    this.helpLight.position.set( 113, 1, 120 );

    var sphereSize = 2;
    var pointLightHelper = new THREE.PointLightHelper( this.helpLight, sphereSize );

    //TODO : find a better way to do it
    for (var i = 0; i < SCENE.children.length; i++) {
      if (SCENE.children[i].name == "primary_plan") {
        SCENE.children[i].add(this.helpLight);
      }
    }
  }

  update() {

  }

  switchHelp(state) {
    for (var i = 0; i < this.mesh.children.length; i++) {
      if (this.mesh.children[i].name != 'bouton_on_icone_rassemblement_1') {
        if (state) {
          this.mesh.children[i].material = this.activeMaterial;
        } else {
          this.mesh.children[i].material = this.inactiveMaterial;
        }

          SOUND.play({event:'help_button'});
      }
      if (state) {
        TweenMax.to(this.mesh.children[i].position,0.5,{
          x:4.3,
          ease:Power1.easeOut});
      } else {
        TweenMax.to(this.mesh.children[i].position,0.5,{
          x:0,
          ease:Power1.easeOut});
      }
    }
    if (state) {
      TweenMax.to(this.helpLight,0.5,{
        intensity:20,
        ease:Power1.easeIn
      });
    } else {
      TweenMax.to(this.helpLight,0.3,{
        intensity:0,
        ease:Power1.easeOut
      });
    }
  }

}
