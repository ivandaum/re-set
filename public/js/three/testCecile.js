
var Test = function() {
    // Set the scene size.
    const WIDTH = window.innerWidth;
    const HEIGHT = window.innerHeight;

    // Set some camera attributes.
    const VIEW_ANGLE = 45;
    const ASPECT = WIDTH / HEIGHT;
    const NEAR = 0.1;
    const FAR = 10000;

    // Get the DOM element to attach to
    const container = document.querySelector('#container');

    // Create a WebGL renderer, camera
    // and a scene
    const renderer = new THREE.WebGLRenderer();
    const camera =
        new THREE.PerspectiveCamera(
            VIEW_ANGLE,
            ASPECT,
            NEAR,
            FAR
        );

    const scene = new THREE.Scene();

    // Add the camera to the scene.
	camera.position.z = 15;
	//camera.lookAt = scene.position;
		// Controls
	var controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.enableZoom = true;
    scene.add(camera);

    // Start the renderer.
    renderer.setSize(WIDTH, HEIGHT);

    container.appendChild(renderer.domElement);

	var light = new THREE.AmbientLight( 0x404040 ); // soft white light
	scene.add( light );

	var vShader = document.querySelector('#vshader');
	var fShader = document.querySelector('#fshader');

	var uniforms = {
	  amplitude: {
	    type: 'f', // a float
	    value: 0
	  }
	};

	var sphereMaterial =
	  new THREE.ShaderMaterial({
		uniforms:       uniforms,
	    vertexShader:   vShader.text,
	    fragmentShader: fShader.text
	  });

	//var geometry = new THREE.SphereBufferGeometry( 3, 90, 90 );
    var geometry = new THREE.CylinderBufferGeometry( 2, 2, 10, 32 );
    // create a simple square shape. We duplicate the top left and bottom right
    // vertices because each vertex needs to appear once per triangle.

	var displacement = new Float32Array(geometry.attributes.position.count);

	for (var v = 0; v < displacement.length; v++) {
	    displacement[v] = Math.random() * 1;
	}

	geometry.addAttribute("displacement", new THREE.BufferAttribute(displacement, 1));

	//bufferGeometry.addAttribute( 'customColor', new THREE.BufferAttribute( colors, 3 ) );
	//bufferGeometry.addAttribute( 'size', new THREE.BufferAttribute( sizes, 1 ) );

	const sphere = new THREE.Mesh(geometry,sphereMaterial);

    scene.add(sphere);

	var frame = 0;
    function update () {
		//uniforms.amplitude.value = Math.sin(frame)*2;
		//frame += 0.1;
		renderer.render(scene, camera);
        requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}


THREE.GodrayShader = {
  uniforms: {
    texture:       { type: 't', value: null },
    lightPosition: { type: 'v2', value: new THREE.Vector2(0, 0) }
  },
  vertexShader: `
    varying vec3 vPos;
    varying vec2 vUv;

    void main() {
      vPos = position;
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
  `,
  fragmentShader: `
    uniform sampler2D texture;
    uniform vec2 lightPosition;

    varying vec3 vPos;
    varying vec2 vUv;

    const int NUM_SAMPLES = 75;

    void main() {
      vec2 dist = vec2(vPos.xy - lightPosition.xy);
      vec2 texPos = vUv;

      float weight = 3.25;
      float illuminationDecay = 1.0;
      float decay = 0.75;
      float exposure = 0.525;
      float density = 0.996;

      dist *= 1.0 /  float(NUM_SAMPLES) * density;

      vec4 blurColor = vec4(0.0, 0.0, 0.0, 0.0);

      for (int i = 0; i < NUM_SAMPLES; i += 1) {
        texPos -= dist;
        vec4 sample = texture2D(texture, texPos);
        sample *= illuminationDecay * weight;
        blurColor += sample;
        illuminationDecay *= decay;
      }

      blurColor *= exposure;
      gl_FragColor = mix(blurColor, texture2D(texture, vUv), 0.55);
    }
  `
}

let width = window.innerWidth
let height = window.innerHeight

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
const renderer = new THREE.WebGLRenderer()
const bufferScene = new THREE.Scene()
const bufferTexture = new THREE.WebGLRenderTarget(width, height, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter})

let meshes = []
let composer

const lightMesh = new THREE.Mesh(
  new THREE.CylinderGeometry( 5, 5, 20, 32 ),
  new THREE.MeshBasicMaterial({ color: 0xFCFCFC })
)
lightMesh.position.set(0, 0, 0)
bufferScene.add(lightMesh)

const renderFrame = () => {
  window.requestAnimationFrame(renderFrame)
  renderer.render(bufferScene, camera, bufferTexture)
  composer.render(scene, camera)
  //renderer.render(scene, camera)
}

const init = () => {
  renderer.setSize(width, height)
  renderer.setClearColor(0x111111)
  document.body.appendChild(renderer.domElement)

  camera.position.set(0, 0, 100)
  camera.lookAt(new THREE.Vector3(0, 0, 0))

  composer = new THREE.EffectComposer(renderer)
  let bufferRender = new THREE.RenderPass(bufferScene, camera)
  let customShader = new THREE.ShaderPass( THREE.GodrayShader )
  customShader.uniforms[ 'texture' ].value = bufferTexture.texture
  customShader.uniforms[ 'lightPosition' ].value = new THREE.Vector2(lightMesh.position.x, lightMesh.position.y)
  customShader.renderToScreen = true

  composer.addPass(bufferRender)
  composer.addPass(customShader)

  renderFrame()
}

init()
