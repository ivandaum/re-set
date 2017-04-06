function rand(min,max) {
  return Math.floor(Math.random()*(max-min+1)+min);
}

function randFloat(min,max) {
  return (Math.random() * (max - min) + min)
}

function render() {
  stats.begin();

  if(typeof APP.render == 'function') {

    APP.render();
    RENDERER.render( SCENE, CAMERA );
  }

  if(CONTROL) {
      CONTROL.update();
  }

  requestAnimationFrame(render);
  stats.end();
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
