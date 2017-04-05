var USER = new UserSocket(),
    APP = null,
    ROOM,
    SCENE,
    RENDERER,
    INITIAL_CAMERA,
    CAMERA,
    RAY,
    APP_DOM = document.querySelector('#app');

// UrlRewriting.bind();
Ajax.bindLinks();


// TODO : when user load the page - desactivate about page
// if(page.type == 'index') {
//   APP = new IndexController();
// }
//
// if(page.type == 'map') {
//   APP = new MapController();
//   APP.bindRooms();
// }
//
// if(page.type == 'room') {
//   USER.enter(page.id);
// }
// if(app == null) window.location = '/'

render();