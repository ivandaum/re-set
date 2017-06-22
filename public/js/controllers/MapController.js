class MapController {
	constructor() {
		if(!isMobile()) {
			INITIAL_CAMERA =  600;
			CAMERA = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 800);

			RENDERER.setClearColor('#000');

			document.querySelector('#canvas-container').innerHTML = "";
			document.querySelector('#canvas-container').appendChild(RENDERER.domElement);
			CONTROL = new THREE.OrbitControls(CAMERA, RENDERER.domElement);
			this.setCamera();
			this.ThreeEntity = new MapTHREE();
		}

		if(hasClass(document.querySelector('.map-days-count'),'disable')) {
			let created_at = new Date(LOADER.db.rooms[0].created_at);
			let now = new Date();
			let days = Math.ceil((now.getTime() - created_at.getTime()) / (24*60*60*1000));
			document.querySelector('.map-days-count .number').innerHTML = days;
			removeClass(document.querySelector('.map-days-count'),'disable')
		}
		return this;
	}

	render() {
		if (this.ThreeEntity) {
			this.ThreeEntity.update();
		}
	}

	getMap() {
		if(isMobile()) return;

		var _this = this;
		Navigator.goTo('canvas-container');

		_this.ThreeEntity.rooms = LOADER.db.rooms;
		_this.ThreeEntity.load();
		socket.emit('get:help_request');
	}

	mapRaycaster(mouse,returnValue) {
		var childrens = [];

		for(var a=0; a<this.ThreeEntity.rooms.length; a++) {
			if(notNull(this.ThreeEntity.rooms[a].mesh)) {
				this.ThreeEntity.rooms[a].mesh.isHover = false;
				childrens.push(this.ThreeEntity.rooms[a].mesh);
			}
		}

		RAY = new THREE.Raycaster(CAMERA.position, mouse.sub(CAMERA.position).normalize());
		var intersects = RAY.intersectObjects(childrens);

		if(returnValue) return this.getActiveRoom(intersects);

		let child = null;
		for (var i = 0; i < intersects.length; i++) {
			child = intersects[i].object;

			if (notNull(child.roomId) && child.canAnimateFinalState) {
				child.isHover = true;
				break;
			}
		}
	}

	getActiveRoom(intersects) {
		for (var i = 0; i < intersects.length; i++) {
			if(notNull(intersects[i].object.roomId)) {
				return intersects[i].object;
			}
		}
	}

	setCamera() {
		RENDERER.setSize(window.innerWidth, window.innerHeight);
		var increase = 1.5;

		CAMERA.position.z = INITIAL_CAMERA / increase;
		CAMERA.position.x = increase;
		CAMERA.position.y = increase;

		var position = new THREE.Vector3(0,0,INITIAL_CAMERA);

		new TweenMax.to(CAMERA.position,4,{ease:Quart.easeOut,x:position.x,y:position.y,z:position.z,onUpdate() {
			CAMERA.lookAt({x: 0, y: 0, z: 0})
		}});

	}
}
