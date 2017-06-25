class AvatarTHREE {
	constructor(user) {
		var _this = this;
		this.mesh = new THREE.Object3D();
		this.name = null;
		this.avatar = null;
		this.textureLoader = new THREE.TextureLoader();

		this.scale = 0.1;
		this.radius = 3;

		if (user && user.color) {
			var color = user.color;
		} else {
			var color = lerpColor('#c93c22','#008cec',randFloat(0,100)/100);
			color = hexToRgb(color);
		}

		var geometry = new THREE.IcosahedronBufferGeometry(this.radius, 0);

		_this.textureLoader.load( PUBLIC_PATH + "images/avatars/map-avatar.png", mapHeight => {
			mapHeight.anisotropy = 0;
			// mapHeight.repeat.set( 3, 3 );
			mapHeight.offset.set( 2, 2 );
			mapHeight.wrapS = mapHeight.wrapT = THREE.RepeatWrapping;

			var material = new THREE.MeshBasicMaterial({
				color: rgbToHex(color.r, color.g, color.b),
				map: mapHeight
			});
			_this.avatar = new THREE.Mesh(geometry, material);
			_this.mesh.add(_this.avatar)
		});

		// this.avatar.rotation.set(0.349066, 0, 0);


		// NAME
		// var loader = new THREE.FontLoader();
		// loader.load('/public/fonts/droidsans/droid_sans_bold.typeface.json', function (font) {
		// 	var textGeometry = new THREE.TextGeometry(user.name, {
		// 		font: font,
		// 		size: 2,
		// 		height: 0
		// 	});
		//
		// 	var textMaterial = new THREE.MeshBasicMaterial({
		// 		color: '#fff'
		// 	});
		//
		// 	_this.name = new THREE.Mesh(textGeometry, textMaterial)
		//
			//_this.mesh.add(_this.name)

			//_this.name.position.y += 5
		//});

		return this;
	}
}
