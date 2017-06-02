function rand(min,max) {
  return Math.floor(Math.random()*(max-min+1)+min);
}

function randFloat(min,max) {
  return (Math.random() * (max - min) + min)
}

function render() {
  stats.begin();

  if(typeof APP.render == 'function' && CAMERA != null) {

    APP.render();
    RENDERER.render( SCENE, CAMERA );
  }

  var pixelRatio = 1;

  if(FPS['current'] > 30) {
      RENDERER.setPixelRatio(window.devicePixelRatio);
  } else {
      RENDERER.setPixelRatio(1);
  }
  requestAnimationFrame(render);
  stats.end();
  FPS['count']++;
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function notNull(object) {
    if(typeof object == 'undefined') return false;

    if(typeof object == null) return false;

    if(!object) return false;

    return true;
}

function isNull(object) {
    if(object) return false;

    if(typeof object == 'undefined') return true;

    if(typeof object == null) return true;

    return false;
}

function isFunction(object) {
    return typeof object == 'function';
}

// Converts from degrees to radians.
Math.radians = function(degrees) {
  return degrees * Math.PI / 180;
};

// Converts from radians to degrees.
Math.degrees = function(radians) {
  return radians * 180 / Math.PI;
};
