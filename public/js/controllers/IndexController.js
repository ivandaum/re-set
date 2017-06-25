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

		var rtParameters = {
			minFilter: THREE.LinearFilter,
			magFilter: THREE.LinearFilter,
			format: THREE.RGBFormat,
			stencilBuffer: true
		};


		var renderBack = new THREE.RenderPass( BACKSCENE, BACKCAM);
		var renderFront = new THREE.RenderPass( SCENE, CAMERA );
		renderFront.clear = false;

		precomposer = new THREE.EffectComposer(RENDERER, new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, rtParameters ));
		precomposer.addPass( renderBack );
		precomposer.addPass( renderFront );

		var renderScene = new THREE.TexturePass( precomposer.renderTarget2.texture );

		var effectNoise = new THREE.ShaderPass( THREE.NoiseShader );
		effectNoise.renderToScreen = true;

		COMPOSERHOME = new THREE.EffectComposer(RENDERER, new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, rtParameters ));

		COMPOSERHOME.addPass( renderScene );
		COMPOSERHOME.addPass( effectNoise );

		renderScene.uniforms[ "tDiffuse" ].value = precomposer.renderTarget2.texture;


		COMPOSERMAP = null;
		COMPOSERROOM = null;
	}

}
