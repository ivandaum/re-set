var Avatar = function(user,position) {
    var _this = this
    this.mesh = new THREE.Object3D()
    this.name = null
    this.avatar = null
    this.scale = 0.1
    this.radius = 4
    this.avatarlength = 100
    var color = user.color

    // var geometry = new THREE.SphereBufferGeometry(this.radius,50,50)

    var geometry = new THREE.Geometry();

    this.getVertices(function(vertex) {
        geometry.vertices.push(vertex);
    })

    var material = new THREE.PointsMaterial({color:rgbToHex(color.r,color.g,color.b)})
    this.avatar = new THREE.Points(geometry, material);


    // NAME
    var loader = new THREE.FontLoader();
    loader.load( 'public/fonts/droidsans/droid_sans_bold.typeface.json', function ( font ) {
      var textGeometry = new THREE.TextGeometry( user.name, {
        font: font,
        size: 2,
        height:0,
        bevelThickness:2,
        bevelSize: 1
      });

      var textMaterial = new THREE.MeshBasicMaterial({
        color:'#fff'
      })
      _this.name = new THREE.Mesh(textGeometry,textMaterial)

      _this.mesh.add(_this.avatar)
      _this.mesh.add(_this.name)

      _this.name.position.y += 5
    });

    return this
}

Avatar.prototype.getVertices = function(callback) {
  for (var i = 0; i < this.avatarlength; i++) {
    var vertex = new THREE.Vector3();

    var theta = THREE.Math.randFloatSpread(360);
    var phi = THREE.Math.randFloatSpread(360);

    vertex.x = this.radius * Math.sin(theta) * Math.cos(phi);
    vertex.y = this.radius * Math.sin(theta) * Math.sin(phi);
    vertex.z = 0 //distance * Math.cos(theta);

    if(typeof callback == 'function') {
      callback(vertex,i)
    }
  }
}
