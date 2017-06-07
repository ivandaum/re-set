class HomeTHREE {
	constructor() {
		this.plan = new THREE.Object3D();
		this.particules = new THREE.Group();
		SCENE.add(this.plan);

		this.pointParameters = [
			[ [1, 1, 0.5], 5 ],
			[ [0.95, 1, 0.5], 4 ],
			[ [0.90, 1, 0.5], 3 ],
			[ [0.85, 1, 0.5], 2 ],
			[ [0.80, 1, 0.5], 1 ]
		];

		this.load();
		this.addLight({x:45,y:45,z:45},75,100,2);
		// this.addLight({x:0,y:0,z:100},120,30,4);
		// CONTROL = new THREE.OrbitControls(CAMERA);
		generateBackground();

		this.movePlanTo = null;
		this.rotation = {x:0,y:0};
		var pointlight = new THREE.PointLight( '#fff', 0.2 );
		pointlight.position.set(10, 10, 100);
		SCENE.add( pointlight );

		this.plan.add(this.particules);
		this.generatesParticules();
		// var pointLightHelper = new THREE.PointLightHelper( pointlight, 1 );
		// SCENE.add( pointLightHelper );
	}

	load() {
		LOADER_THREE.home();
	}

	update() {

		if(this.movePlanTo) {

			if(!APP.scrollingToUsername) {
				this.plan.position.y -= (-this.movePlanTo.y + this.plan.position.y) * 0.1;
				this.plan.rotation.y += ((this.movePlanTo.x/100) - this.plan.rotation.y) * 0.05;
			}


			this.plan.position.x += (this.movePlanTo.x - this.plan.position.x) * 0.1;
			this.plan.rotation.x += (-(this.movePlanTo.y/100) - this.plan.rotation.x) * 0.05;
		}

		for(let i=0; i<this.particules.children.length; i++) {
			var p = this.particules.children[i];
			p.rotation.y += this.pointParameters[i][1] / 8000;
		}
	}

	movePlan(e) {
		var mouse = e.mouse;
		this.movePlanTo = {
			x: mouse.x / 5,
			y: mouse.y / 10
		};

	}

	addLight(position,distance,intensity,angle) {
		// var pointlight = new THREE.PointLight( '#131313', 0.2 );
		// pointlight.castShadow = true;
		// pointlight.position.set(10, 10, 100);
		// SCENE.add( pointlight );
		//
		//
		// var sphereSize = 10;
		// var pointLightHelper = new THREE.PointLightHelper( pointlight, sphereSize );
		// SCENE.add( pointLightHelper );
		//
		var a = new THREE.AmbientLight('#fff',0.1);
		SCENE.add(a);

		distance = distance || 100;
		intensity = intensity || 30;
		angle = angle || 6;
		var spot = new THREE.SpotLight( '#7b7777', intensity );
		spot.position.set(position.x, position.y, position.z);
		spot.angle = Math.PI / angle;
		spot.decay = 3;
		spot.distance = distance;
		this.plan.add( spot );

		// var spotLightHelper = new THREE.SpotLightHelper( spot );
		// SCENE.add( spotLightHelper );
	}

	generatesParticules() {
		let materials = [];
		let geometry = new THREE.Geometry();
		for (let  i = 0; i < 5000; i ++ ) {
			var vertex = new THREE.Vector3();
			vertex.x = Math.random() * 2000 - 1000;
			vertex.y = Math.random() * 2000 - 1000;
			vertex.z = Math.random() * 2000 - 1000;
			geometry.vertices.push( vertex );
		}

		for (let  i = 0; i < this.pointParameters.length; i ++ ) {
			let color = this.pointParameters[i][0];
			let size  = this.pointParameters[i][1];

			materials[i] = new THREE.PointsMaterial( { size: size,color:"#333" } );
			let particles = new THREE.Points( geometry, materials[i] );
			particles.rotation.x = Math.random() * 6;
			particles.rotation.y = Math.random() * 6;
			particles.rotation.z = Math.random() * 6;
			this.particules.add( particles );
		}
	}
}
