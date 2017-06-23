import * as THREE from 'three';
import Navigator from 'services/Navigator';

window.THREE = THREE;


// var glslify = require('glslify');
// var WAGNER = require('@superguigui/wagner');
// var NoisePass = require('@superguigui/wagner/src/passes/noise/noise');


//
//
// var stats = require('./js/vendors/stats.js');
//
// var Ajax = require('./js/services/Ajax.js');
// var FlashMessage = require('./js/services/FlashMessage.js');
// var InteractionMessage = require('./js/services/InteractionMessage.js');
// var Loader = require('./js/services/Loader.js');
// var LoaderTHREE = require('./js/services/LoaderTHREE.js');
// var Navigator = require('./js/services/Navigator.js');
// var Transition = require('./js/services/Transition.js');
//
// var THREE = require('./js/socket');
// var THREE = require('./js/three');
// var THREE = require('./js/controllers');
// var THREE = require('./js/main.js');

var DISABLE_DEBUG = true;
var QUICK_LOADING = false;
console.realLog = console.log;
console.log = function () {
	if (arguments[0] == 'THREE.WebGLRenderer') return;
	if (arguments[0] == 'OBJLoader') return;

	console.realLog.apply (console, arguments);

};

window.addEventListener( 'resize', function() {
	CAMERA.aspect = window.innerWidth / window.innerHeight;
	CAMERA.updateProjectionMatrix();
	RENDERER.setSize( window.innerWidth, window.innerHeight );
}, false );

let ROOM,
  APP = null,
	CAMERA,
  RAY,
	CONTROL,
	INITIAL_CAMERA;

const USER = new UserSocket(),
		SCENE = new THREE.Scene(),
		RENDERER = new THREE.WebGLRenderer(),
		LOADER_THREE = new LoaderTHREE(),
		CLOCK = new THREE.Clock(),
		BACKSCENE = new THREE.Scene(),
		BACKCAM = new THREE.Camera(),
		LOADER = new Loader();

var BACKGROUND = null;

Navigator.init();
RENDERER.shadowMap.enabled = true;
RENDERER.shadowMap.type = THREE.PCFSoftShadowMap;
RENDERER.shadowMapSoft = true;
RENDERER.gammaInput = true;
RENDERER.gammaOutput = true;
RENDERER.autoClearColor = true;

// let COMPOSER = new WAGNER.Composer(RENDERER);
//
// let noisePass = new NoisePass({
// });
// COMPOSER.reset();
// COMPOSER.render(SCENE, CAMERA);
// COMPOSER.pass(noisePass);
// COMPOSER.toScreen();

if(window.location.host != 'localhost:3000') {
	var background = '#ff7212';
	var padding = 3;
	console.log('%cDevelopers : ', 'padding:' + padding +'px; background: ' + background + '; color: #fff');
	console.log('%cIvan Daum : http://ivandaum.fr', 'padding:' + padding +'px; background: ' + background + '; color: #fff');
	console.log('%cCécile Delmon : http://ceciledelmon.com', 'padding:' + padding +'px; background: ' + background + '; color: #fff');

	console.log('');
	console.log('%cArt directors : ', 'padding:' + padding +'px; background: ' + background + '; color: #fff');
	console.log('%cFlorian Moreau : http://florianmoreau.fr', 'padding:' + padding +'px; background: ' + background + '; color: #fff');
	console.log('%cManon Jouet : https://twitter.com/ManonJouet', 'padding:' + padding +'px; background: ' + background + '; color: #fff');

	if(isMobile()) {
		console.log('');
		console.log('%cVisit RESET on desktop to enjoy experiment : ' + window.location.href, 'padding:' + padding +'px; background: ' + background + '; color: #fff');
		console.log('');
	}
}
if(isMobile()) {
	addClass(document.querySelector('body'),'mobile');
	Navigator.goTo('canvas-container');
	if(hasClass(document.querySelector('.go-home'),'disable')) {
		removeClass(document.querySelector('.go-home'),'disable');
	}
	LOADER.init(function() {
		USER.enter('map');
	});
} else {
	if(roomId == 'map') {
		Navigator.goTo('canvas-container');
		if(hasClass(document.querySelector('.go-home'),'disable')) {
			removeClass(document.querySelector('.go-home'),'disable');
		}
		LOADER.init(function() {
			USER.enter('map');
		});
	}
	else if(roomId != null) {
		USER.enter(roomId);
		Navigator.goTo('canvas-container');
	} else {
		APP = new IndexController();
		Navigator.goTo('home');
	}
	render();
}

roomId = null;
