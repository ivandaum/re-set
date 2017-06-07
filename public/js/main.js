DISABLE_DEBUG = true;
console.realLog = console.log;
console.log = function () {
	if (arguments[0] == 'THREE.WebGLRenderer') return;
	if (arguments[0] == 'OBJLoader') return;

	console.realLog.apply (console, arguments);

};

let ROOM,
    APP = null,
	CAMERA,
    RAY,
	CONTROL,
	FPS=[],
	INITIAL_CAMERA;

const USER = new UserSocket(),
	SCENE = new THREE.Scene(),
	RENDERER = new THREE.WebGLRenderer(),
	LOADER_THREE = new LoaderTHREE(),
	CLOCK = new THREE.Clock();
	BACKSCENE = new THREE.Scene(),
	BACKCAM = new THREE.Camera();

Navigator.init();

setInterval(function() {
	FPS['current'] = FPS['count'];
	FPS['count'] = 0;
},1000);
RENDERER.shadowMap.enabled = true;
RENDERER.shadowMap.type = THREE.PCFSoftShadowMap;
RENDERER.shadowMapSoft = true;

if(roomId != null) {
	USER.enter(roomId);
	roomId = null;
	Navigator.goTo('canvas-container');
} else {
	APP = new IndexController();
	APP.jumpToMap();
	// Navigator.goTo('home');
}

render();
