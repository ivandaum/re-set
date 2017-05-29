class TubeTHREE {
  constructor(mesh) {

    this.mesh = mesh;
    this.count = 0
  }

  update(percent) {
    percent = (percent/100);
    var v = this.mesh.children[0].material.uniforms.whitePath.value;

    if(v >= percent) return;

    // TODO : launch after moving tube

    this.mesh.children[0].material.uniforms.whitePath.value += 0.01;
    APP.ThreeEntity.interactionLights.children[1].intensity += this.count*3;
  }

}
