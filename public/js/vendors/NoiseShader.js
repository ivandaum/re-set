THREE.NoiseShader = {
	uniforms: {
		"tDiffuse":   { value: null },
		"noise":   { value: 0.05 }
	},
	vertexShader: [
		"varying vec2 vUv;",
		"void main() {",
			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
		"}"
	].join( "\n" ),
	fragmentShader: [
		"uniform float noise;",
		"uniform sampler2D tDiffuse;",
		"float random(vec3 scale,float seed){return fract(sin(dot(gl_FragCoord.xyz+seed,scale))*43758.5453+seed);}",
		"varying vec2 vUv;",
		"void main() {",
			"vec4 cTextureScreen = texture2D( tDiffuse, vUv );",
			"float n = noise * ( .5 - random( vec3( 1. ), length( gl_FragCoord ) ) );",
			"gl_FragColor = vec4( cTextureScreen + vec4( n ));",
		"}"
	].join( "\n" )
};
