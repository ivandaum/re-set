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
	APP.jumpToMap();
	// Navigator.goTo('home');
}

render();
