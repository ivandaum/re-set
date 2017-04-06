var USER = new UserSocket(),
    APP = null,
    ROOM,
    SCENE,
    RENDERER,
    INITIAL_CAMERA,
    CAMERA,
    RAY;

// UrlRewriting.bind();

Navigator.init();
APP = new IndexController();

render();