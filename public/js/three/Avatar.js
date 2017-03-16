var Avatar = function(position,color) {
    var geometry = new THREE.SphereGeometry(4,50,50)
    var material = new THREE.MeshLambertMaterial({
      color:rgbToHex(color.r,color.g,color.b)
    })
    this.mesh = new THREE.Mesh(geometry,material)
    return this
}
