class IndexController {
	constructor() {

		INITIAL_CAMERA = 250;
		CAMERA = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 800);

		RENDERER.setClearColor('#000');

		document.querySelector('#canvas-container').innerHTML = "";
		document.querySelector('#canvas-container').appendChild(RENDERER.domElement);

		USER.room = 'home';

		this.section = "intro";
		this.setCamera();
		this.scrollingToUsername = false;
		this.ThreeEntity = new HomeTHREE();
	}

	render() {
		if (this.ThreeEntity) {
			this.ThreeEntity.update();
		}
	}
	setCamera() {
		RENDERER.setSize(window.innerWidth, window.innerHeight);

		CAMERA.position.z = INITIAL_CAMERA;
		CAMERA.position.x = 0;
		CAMERA.position.y = 0;
		CAMERA.lookAt({x: 0, y: 0, z: 0})

		COMPOSERHOME = new THREE.EffectComposer(RENDERER);
		var effectNoise = new THREE.ShaderPass( THREE.NoiseShader );
		effectNoise.renderToScreen = true;
		COMPOSERHOME.addPass( new THREE.RenderPass( BACKSCENE, BACKCAM ));
		COMPOSERHOME.addPass( new THREE.RenderPass( SCENE, CAMERA ) );

		COMPOSERMAP = null;
		COMPOSERROOM = null;
	}

}
