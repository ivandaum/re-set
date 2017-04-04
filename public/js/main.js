var USER = new UserSocket(),ROOM,SCENE,RENDERER,INITIAL_CAMERA,CAMERA,RAY,RENDER_LIST = [];

var APP = null;

// BETTER PARSE url
if(page.type == 'index') {
  APP = new IndexApp();
}

if(page.type == 'map') {
  APP = new MapApp();
  APP.bindRooms();
}

if(page.type == 'room') {
  USER.enter(page.id);
};

if(app == null) window.location = '/'

render()
