class AvatarTHREE {
	constructor(user) {
		var _this = this;
		this.mesh = new THREE.Object3D();
		this.name = null;
		this.avatar = null;
		this.scale = 0.1;
		this.radius = 3;
		var color = user.color;

		var geometry = new THREE.IcosahedronBufferGeometry(this.radius, 0);
		var material = new THREE.MeshPhongMaterial({color: rgbToHex(color.r, color.g, color.b)});
		this.avatar = new THREE.Mesh(geometry, material);
		this.avatar.rotation.set(0.349066, 0, 0);

		// NAME
		var loader = new THREE.FontLoader();
		loader.load('/public/fonts/droidsans/droid_sans_bold.typeface.json', function (font) {
			var textGeometry = new THREE.TextGeometry(user.name, {
				font: font,
				size: 2,
				height: 0
			});

			var textMaterial = new THREE.MeshBasicMaterial({
				color: '#fff'
			});

			_this.name = new THREE.Mesh(textGeometry, textMaterial)

			_this.mesh.add(_this.avatar)
			_this.mesh.add(_this.name)

			_this.name.position.y += 5
		});

		return this;
	}
}
