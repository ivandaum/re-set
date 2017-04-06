var USER = new UserSocket(),
    APP = null,
    ROOM,
    SCENE,
    RENDERER,
    CAMERA,
    RAY,
	CONTROL;

// UrlRewriting.bind();

Navigator.init();
APP = new IndexController();
APP.jumpToMap();

render();