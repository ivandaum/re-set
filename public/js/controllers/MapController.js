class MapController {
	constructor() {

		INITIAL_CAMERA = 600;
		CAMERA = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 800);

		RENDERER.setClearColor('#000');

		document.querySelector('#canvas-container').innerHTML = "";
		document.querySelector('#canvas-container').appendChild(RENDERER.domElement);
		CONTROL = new THREE.OrbitControls(CAMERA, RENDERER.domElement);
		this.setCamera();
		this.ThreeEntity = new MapTHREE();
		CONTROL = "";

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
		var _this = this;
		Navigator.goTo('canvas-container');

		_this.ThreeEntity.rooms = LOADER.db.rooms;
		_this.ThreeEntity.load();
		socket.emit('get:help_request');
	}

	mapRaycaster(mouse,returnValue) {
		var childrens = [];
		for(var a=0; a<this.ThreeEntity.rooms.length; a++) {
			this.ThreeEntity.rooms[a].mesh.isHover = false;
			this.ThreeEntity.rooms[a].mesh.canAnimate = true;
			childrens.push(this.ThreeEntity.rooms[a].mesh);
		}

		RAY = new THREE.Raycaster(CAMERA.position, mouse.sub(CAMERA.position).normalize());
		var intersects = RAY.intersectObjects(childrens);

		if(returnValue) return this.getActiveRoom(intersects);

		// let child = null;
		// for (var i = 0; i < intersects.length; i++) {
		// 	child = intersects[i].object;
		//
		// 	//hover test à remettre dans le if
		// 	if (notNull(child.roomId) && child.canAnimate) {
		// 		// var color = {v:'#' + new THREE.Color(child.material.color).getHexString()};
		// 		// new TweenMax.to(color,0.5,{
		// 		// 	v:RoomMaterial().color.hover,
		// 		// 	onUpdate:function() {
		// 		// 		child.material.color.set(color.v)
		// 		// 	},
		// 		// 	onComplete: function() {
		// 		// 		child.canAnimate = true;
		// 		// 		child.isHover = false;
		// 		// 	}
		// 		// })
		// 		child.material.color.set(RoomMaterial().color.hover);
		// 		child.isHover = true;
		// 		break;
		// 	}
		// }
		//
		// // FOR THE REST OF CHILDRENS
		// for (var i = 0; i < childrens.length; i++) {
		// 	if(!childrens[i].isHover && childrens[i].canAnimate) {
		// 			if(childrens[i].db.is_finish) {
		// 					childrens[i].material.color.set(RoomMaterial().color.room_finish);
		// 			} else {
		// 				childrens[i].material.color.set(RoomMaterial().color.basic);
		// 			}
		// 	}
		// }
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

		CAMERA.position.z = INITIAL_CAMERA;
		CAMERA.position.x = 0;
		CAMERA.position.y = 0;
		CAMERA.lookAt({x: 0, y: 0, z: 0})
	}
}
