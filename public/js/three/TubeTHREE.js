class TubeTHREE {
  constructor(mesh) {
    this.mesh = mesh;
    this.count = 0

	this.uniforms = {
		whitePath: {
			type: 'f', // a float
			value: 0
		}
	};
	this.accomplishement = this.uniforms.whitePath.value/100;
	this.mesh.children[0].material.uniforms.whitePath.value = this.accomplishement;
  }

  update(percent) {
    percent = (percent/100);
    var v = this.mesh.children[0].material.uniforms.whitePath.value;

    if(v >= percent) return;

    // TODO : launch after moving tube

    //this.mesh.children[0].material.uniforms.whitePath.value += 0.001;
    // APP.ThreeEntity.interactionLights.children[1].intensity += this.count*3;
  }

  setState(state, updatable) {
	  if (updatable) {
		  this.accomplishement = state.percent_progression/100;
      console.log('setting state', this.accomplishement);
    	  new TweenMax.to(this.mesh.children[0].material.uniforms.whitePath,2,{
    		  value: this.accomplishement,
    		  ease:Power1.easeInOut});
	  }
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
