class RoomController {
	constructor(roomId,callback) {
		INITIAL_CAMERA = 210;
		CAMERA = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 1, 1000);

		document.querySelector('#canvas-container').innerHTML = "";
		document.querySelector('#canvas-container').appendChild(RENDERER.domElement);

		this.id = roomId;
		this.setCamera();
		this.interactionsMessages = [];

		Transition.roomNav.show();

		var _that = this;


		if(LOADER.db.rooms.length < 1) {
			LOADER.init(function() {
				_that.init(callback);
			})
		} else {
			_that.init(callback);
		}
		if(!hasClass(document.querySelector('.map-days-count'),'disable')) {
			addClass(document.querySelector('.map-days-count'),'disable')
		}
		return this;
	}

	init(callback) {
		let data = LOADER.getRoom(this.id);

		if(isNull(data.db.room) || data.db.interactions.length == 0) {
			USER.leave(function() {
				USER.enter('map');
			});
			return false;
		}

		this.ThreeEntity = new RoomTHREE(data);
		this.ThreeEntity.usersVectors = [];

		var interactions = data.db.interactions;

		var interactionNotFinished = 0;
		for(var e=0;e<interactions.length;e++) {
			if(interactions[e].is_finish == false) interactionNotFinished++;
		}

		if(interactionNotFinished == 0 || data.db.room.is_finish) {
			SOUND.testAmbiance(100);
			socket.emit('get:room:participation',{room:USER.room});
		}

		if(isFunction(callback)) {
			callback();
		}
	}

	render() {

		if (!this.ThreeEntity) return;

		this.ThreeEntity.update()


		for(let p=0; p<this.interactionsMessages.length; p++) {
			if(this.interactionsMessages[p].DOM == false) {
				this.interactionsMessages.splice(p,1);
				continue;
			}

			this.interactionsMessages[p].update();
		}
	}

	roomRaycaster(data) {

		if(USER.freezeThree) return;

		if(!notNull(APP.ThreeEntity.interactions) && !notNull(APP.ThreeEntity.button)) return false;

		var childrens = [];
		var childrensMesh = [];
		var mouse = data.mouse;
		var interactions = data.interactions || APP.ThreeEntity.interactions;

		// forming three chilrens
		for (var i = 0; i < interactions.length; i++) {
			childrensMesh.push(interactions[i].mesh); // {mesh: ...}
			childrens.push(interactions[i]);
		}

		childrensMesh.push(APP.ThreeEntity.button.mesh);
		childrens.push(APP.ThreeEntity.button);

		RAY = new THREE.Raycaster(CAMERA.position, mouse.sub(CAMERA.position).normalize());
		var intersects = RAY.intersectObjects(childrensMesh,true);

		if (intersects.length > 0) {
			for (var i = 0; i < intersects.length; i++) {
				for (var a = 0; a < childrensMesh.length; a++) {
					if(childrensMesh[a].uuid ==  intersects[i].object.parent.uuid) {
						return childrens[a];
					}
				}
			}
		}

	}

	setCamera() {
		let increase = 1.5;
		RENDERER.setSize(window.innerWidth, window.innerHeight);
		CAMERA.position.z = INITIAL_CAMERA*increase;
		CAMERA.position.x = -10*increase;
		CAMERA.position.y = 130*increase;

		var position = new THREE.Vector3(-10,130,INITIAL_CAMERA);

		new TweenMax.to(CAMERA.position,2,{ease:Quart.easeOut,x:position.x,y:position.y,z:position.z,onUpdate() {
			CAMERA.lookAt({x: 0, y: 70, z: 0})
		}});

		// pour la page about
		// var effect = new THREE.ShaderPass( THREE.FilmShader );
		// //var effectHBlur = new THREE.ShaderPass( THREE.HorizontalBlurShader );
		// var effectVBlur = new THREE.ShaderPass( THREE.VerticalBlurShader );
		// //effectHBlur.uniforms[ 'h' ].value = 2 / ( window.innerWidth / 2 );
		// effectVBlur.uniforms[ 'v' ].value = 2 / ( window.innerHeight / 2 );
		//
		// effectVBlur.renderToScreen = true
		// COMPOSER.addPass( effectVBlur );

		COMPOSERROOM = new THREE.EffectComposer(RENDERER);
		var effectNoise = new THREE.ShaderPass( THREE.NoiseShader );
		effectNoise.renderToScreen = true;
		COMPOSERROOM.addPass( new THREE.RenderPass( SCENE, CAMERA ) );
		COMPOSERROOM.addPass( effectNoise );

		COMPOSERMAP = null;
		COMPOSERHOME = null;

	}
}
