var Room = function(name) {
  this.plan = new THREE.Object3D()
  this.users = []
  this.avatars = []
  this.name = name

  SCENE.add(this.plan)
}

Room.prototype.update = function() {
  for (var i = 0; i < this.users.length; i++) {
    this.moveUser(this.users[i])
  }
}

Room.prototype.addUser = function(user) {

  var avatar = this.makeAvatar(new THREE.Vector3(0,0,0),user.color)

  this.avatars[user.id] = avatar
  this.plan.add(this.avatars[user.id])

}

Room.prototype.moveUser = function(user) {
    if(!user.mouse) {
        user.mouse = new THREE.Vector3(0,0,0)
    }

    this.avatars[user.id].position.set(
      user.mouse.x,
      user.mouse.y,
      user.mouse.z
    )

    this.avatars[user.id].rotation.y += 0.01
}

Room.prototype.makeAvatar = function(position,color) {

  var geometry = new THREE.DodecahedronBufferGeometry(5,0)
  var material = new THREE.MeshLambertMaterial({
    color:rgbToHex(color.r,color.g,color.b)
  })
  console.log(color);
  return new THREE.Mesh(geometry,material)

}
