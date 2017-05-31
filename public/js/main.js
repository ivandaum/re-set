DISABLE_DEBUG = true;
console.realLog = console.log;
console.log = function () {
	if (arguments[0] == 'THREE.WebGLRenderer') return;
	if (arguments[0] == 'OBJLoader') return;

	console.realLog.apply (console, arguments);

};

var USER = new UserSocket(),
    APP = null,
    ROOM,
    SCENE,
    RENDERER,
    CAMERA,
    RAY,
	CONTROL,
	INITIAL_CAMERA,
	CLOCK = new THREE.Clock();

Navigator.init();

if(roomId != null) {
	USER.enter(roomId);
	roomId = null;
	Navigator.goTo('canvas-container');
} else {
	APP = new IndexController();
	// APP.jumpToMap();
	Navigator.goTo('home');
}

render();
