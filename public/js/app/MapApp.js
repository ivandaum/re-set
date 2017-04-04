var MapApp = function() {
}

MapApp.prototype = {
  getMap: function() {
      var _this = this;
      new Ajax()
      .get('/map',function(data) {
          document.querySelector('#app').innerHTML = data
      });
  }
}
