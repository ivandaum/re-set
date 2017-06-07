class HomeTHREE {
	constructor() {
		this.plan = new THREE.Object3D();
		SCENE.add(this.plan);
		this.load();
		this.addLight();
		CONTROL = new THREE.OrbitControls(CAMERA);
	}

	load() {
		LOADER_THREE.home();
	}

	update() {

	}

	movePlan(e) {

	}

	addLight() {
		var pointlight = new THREE.PointLight( 0xffffff, 5 );
		pointlight.castShadow = true;
		pointlight.position.set(0, 40, 0);
		SCENE.add( pointlight );

		var a = new THREE.AmbientLight('#fff');
		SCENE.add(a);
	}
}
