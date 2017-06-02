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
    // APP.ThreeEntity.interactionLights.children[1].intensity += this.count*3;
  }

}

//
// 		// TODO: Refactore pipe avancement and light declaration
// 		if (this.firstStep && this.uniforms.whitePath.value < 0.6) {
// 			this.count += 0.0001;
// 			this.uniforms.whitePath.value += Math.sin(this.count);
// 			this.interactionLights.children[2].intensity += this.count*5;
// 			// TODO
// 			//this.studio.children[0].material.color
// 		}
// 		if (this.secondStep && this.uniforms.whitePath.value < 1) {
// 			this.count += 0.0001;
// 			this.uniforms.whitePath.value += Math.sin(this.count);
// 			this.interactionLights.children[1].intensity += this.count*3;
