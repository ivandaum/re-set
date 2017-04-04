var MapApp = function() {
  this.canRender = false;
}

MapApp.prototype = {
  getMap: function() {
      var _this = this;

      new Ajax()
      .get('/map',function(data) {
          document.querySelector('#app').innerHTML = data
          _this.bindRooms();
      });
  },
  bindRooms: function() {
    var rooms = document.querySelectorAll('.room');

    for(var i=0; i<rooms.length; i++) {
      var room = rooms[i];
      room.addEventListener('click',function(e) {
        e.preventDefault();

        var roomId = this.dataset.id;
        USER.enter(roomId);
      })
    }
  }
}
