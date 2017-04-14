var USER = new UserSocket(),
    APP = null,
    ROOM,
    SCENE,
    RENDERER,
    CAMERA,
    RAY,
	CONTROL,
	CLOCK = new THREE.Clock();

// UrlRewriting.bind();

Navigator.init();
APP = new IndexController();
APP.jumpToMap();

render();
