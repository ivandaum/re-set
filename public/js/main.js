var USER = new UserSocket(),
    APP = null,
    ROOM,
    SCENE,
    RENDERER,
    CAMERA,
    RAY,
	CONTROL,
	CLOCK = new THREE.Clock();

Navigator.init();
if(roomId != null) {
	USER.enter(roomId);
	roomId = null;
	Navigator.goTo('canvas-container');
} else {
	APP = new IndexController();
	APP.jumpToMap();
}

render();
