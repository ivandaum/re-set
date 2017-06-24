function rand(min,max) {
  return Math.floor(Math.random()*(max-min+1)+min);
}

function randFloat(min,max) {
  return (Math.random() * (max - min) + min)
}

function randomControlled(n,length) {
    return n%2==0 ? 100 / (length-n) : 100 / (n-length)
}

function shuffle(a) {
    for (let i = a.length; i; i--) {
        let j = Math.floor(Math.random() * i);

        // let j = Math.floor(randomControlled(i,length) * i) ; // totally random assignation
        [a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
}

var konami =  function(e) {
    if(USER.room != 'map') return;
    e = e || APP.ThreeEntity.rooms.length
    for (var i = 0; i < e; i++) {
      APP.ThreeEntity.rooms[i].is_finish = true;
    }
}

function RoomMaterial() {
  var color = {
    basic: '#060606',
    hover:'#96948d',
    room_finish:'#ffffff',
    help_request:'#ff7212'
  };

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
function lerpColor(a, b, amount) {

    var ah = parseInt(a.replace(/#/g, ''), 16),
        ar = ah >> 16, ag = ah >> 8 & 0xff, ab = ah & 0xff,
        bh = parseInt(b.replace(/#/g, ''), 16),
        br = bh >> 16, bg = bh >> 8 & 0xff, bb = bh & 0xff,
        rr = ar + amount * (br - ar),
        rg = ag + amount * (bg - ag),
        rb = ab + amount * (bb - ab);

    return '#' + ((1 << 24) + (rr << 16) + (rg << 8) + rb | 0).toString(16).slice(1);
}

function generateBackgroundTexture(p) {
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

    // var c = {v:'#000000'}
    // new TweenMax.to(c,1,{v:'#ffffff',onUpdate:function() { console.log(c.v) }});

    var color = {
      start: ['#171717','#fefefe'],
      end: ['#060606','#dddddd']
    };

    if(LOADER.db.map.rooms > 0) {
      p = p || LOADER.db.map.finished / LOADER.db.map.rooms * 100;
      gradient.addColorStop(0, lerpColor(color.start[0],color.start[1],p/100)); // light blue
      gradient.addColorStop(1, lerpColor(color.end[0],color.end[1],p/100)); // dark blue
    } else {
      gradient.addColorStop(0, color.start[0]); // light blue
      gradient.addColorStop(1, color.end[0]); // dark blue
    }
    context.fillStyle = gradient;
    context.fill();
    var texture =  new THREE.Texture(canvas);
    texture.needsUpdate = true;
    var material =   new THREE.MeshBasicMaterial({
        map:texture,
        overdraw:0.5
    })
    material.depthTest = false;
    material.depthWrite = false;

    return material;
}

function createBackground(material) {

    BACKGROUND = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2, 0),material);

    // Create your background scene
    BACKSCENE.add(BACKCAM);
    BACKSCENE.add(BACKGROUND);
}
function render() {
  // stats.begin();

  if(!USER.freezeThree && notNull(APP) && isFunction(APP.render) && CAMERA != null) {
    APP.render();
  	RENDERER.autoClear = false;
  	RENDERER.clear();
  	RENDERER.render( BACKSCENE , BACKCAM );
    RENDERER.render( SCENE, CAMERA );
  }

  var pixelRatio = 1;

  RENDERER.setPixelRatio(window.devicePixelRatio);
  requestAnimationFrame(render);
  // stats.end();
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

function isMobile() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};
