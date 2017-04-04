var USER = new UserSocket(),ROOM,SCENE,RENDERER,INITIAL_CAMERA,CAMERA,RAY,RENDER_LIST = [];

document.querySelector('.start-tutorial').addEventListener('click',function() {
  document.querySelector('.username-form').style.display = 'block';
  document.querySelector('.start-tutorial').style.display = 'none';
})
document.querySelector('.user-new-name').addEventListener('keydown',function(e) {
  if(e.which != 13) return;

  var name = document.querySelector('.user-new-name').value;
  USER.changeName(name);
})
//    var name = 'Ivan'
    // roomApp = new RoomApp()

    // DEMO PURPOOSE - FORCE ROOM TO APPEAR
//    roomApp.enterRoom('presentation')
