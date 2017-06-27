class AvatarTHREE {
	constructor(user) {
		var _this = this;
		this.mesh = new THREE.Object3D();
		this.name = null;
		this.avatar = null;

		this.scale = 0.1;
		this.radius = 3;

		var color = lerpColor('#c93c22','#008cec',randFloat(0,100)/100);
		if (user && user.color) {
			console.log(user);
			color = rgbToHex(
				user.color.r,
				user.color.g,
				user.color.b
			);
		}

		this.avatar = LOADER.mesh.avatar.clone();
		this.mesh.add(this.avatar);

		this.avatar.children[0].material = this.avatar.children[0].material.clone();
		this.avatar.children[0].material.color.set(color);

		return this;
	}
}
