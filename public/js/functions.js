function rand(min,max) {
  return Math.floor(Math.random()*(max-min+1)+min);
}

function randFloat(min,max) {
  return (Math.random() * (max - min) + min)
}

function shuffle(a) {
    for (let i = a.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
}

function RoomMaterial() {
  var color = {
    basic: '#060606',
    hover:'#ff0000'
  }
  var material = {

    basic: new THREE.MeshPhysicalMaterial({
      color: color.basic,
      shading: THREE.SmoothShading,
      clearCoat: 5,
      map: LOADER.textures.room,
      clearCoatRoughness: 1,
      bumpScale  :  0.3
    }),
    hover: new THREE.MeshLambertMaterial({color: '#ff7212'}),
    help: new THREE.MeshBasicMaterial({color: '#eeeeee'}),
    finished: new THREE.MeshBasicMaterial({color: '#ff00ff'})
  }
  return {
      color:color,
      material,material
  }
}

function generateBackground() {

    var size = 512;

    // create canvas
    let canvas = document.createElement( 'canvas' );
    canvas.width = size;
    canvas.height = size;

    // get context
    var context = canvas.getContext( '2d' );

    // draw gradient
    context.rect( 0, 0, size, size );
    var gradient = context.createRadialGradient(size/2,size/2,5,size/2,size/2,size);
    gradient.addColorStop(0, '#171717'); // light blue
    gradient.addColorStop(1, '#060606'); // dark blue
    context.fillStyle = gradient;
    context.fill();

    var texture = new THREE.Texture( canvas );

    texture.needsUpdate = true;

    var backgroundMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2, 0),
    new THREE.MeshBasicMaterial({
        map:texture,
        overdraw:0.5
    }));

    backgroundMesh.material.depthTest = false;
    backgroundMesh.material.depthWrite = false;

    // Create your background scene
    BACKSCENE.add(BACKCAM);
    BACKSCENE.add(backgroundMesh);

}

function render() {
  stats.begin();

  if(typeof APP.render == 'function' && CAMERA != null) {

    APP.render();
  	RENDERER.autoClear = false;
  	RENDERER.clear();
  	RENDERER.render(BACKSCENE , BACKCAM );
    RENDERER.render( SCENE, CAMERA );
  }

  var pixelRatio = 1;

  // if(FPS['current'] > 30) {
  //     RENDERER.setPixelRatio(window.devicePixelRatio);
  // } else {
  //     RENDERER.setPixelRatio(1);
  // }
  RENDERER.setPixelRatio(window.devicePixelRatio);
  requestAnimationFrame(render);
  stats.end();
  FPS['count']++;
}
function hasClass(el, className) {
    if (el.classList)
        return el.classList.contains(className);
    else
        return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
}
function addClass(el, className) {
    if (el.classList)
        el.classList.add(className);
    else if (!hasClass(el, className)) el.className += " " + className;
}
function removeClass(el, className) {
    if (el.classList)
        el.classList.remove(className);
    else if (hasClass(el, className)) {
        var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
        el.className=el.className.replace(reg, ' ')
    }
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}


function notNull(object) {
    if(typeof object == 'undefined') return false;

    if(typeof object == null) return false;

    if(!object) return false;


    if(object == null) return false;

    if(object == 'undefined') return false;

    return true;
}

function isNull(object) {
    if(object) return false;

    if(typeof object == 'undefined') return true;

    if(typeof object == null) return true;

    if(object == null) return true;

    if(object == 'undefined') return true;

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

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomSpherePoint(x0,y0,z0,radius){
   var u = Math.random();
   var v = Math.random();
   var theta = 2 * Math.PI * u;
   var phi = Math.acos(2 * v - 1);
   var x = x0 + (radius * Math.sin(phi) * Math.cos(theta));
   var y = y0 + (radius * Math.sin(phi) * Math.sin(theta));
   var z = z0 + (radius * Math.cos(phi));
   return [x,y,z];
}

function findChild(element, className) {
    var foundElement = null, found;
    function recurse(element, className, found) {
        for (var i = 0; i < element.childNodes.length && !found; i++) {
            var el = element.childNodes[i];
            var classes = el.className != undefined? el.className.split(" ") : [];
            for (var j = 0, jl = classes.length; j < jl; j++) {
                if (classes[j] == className) {
                    found = true;
                    foundElement = element.childNodes[i];
                    break;
                }
            }
            if(found)
                break;
            recurse(element.childNodes[i], className, found);
        }
    }
    recurse(element, className, false);
    return foundElement;
}
