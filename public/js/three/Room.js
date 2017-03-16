var Room = function(name) {
  this.plan = new THREE.Object3D()
  this.users = []
  this.avatars = []
  this.name = name
  this.removeUsersArray = []
  SCENE.add(this.plan)


  var al = new THREE.AmbientLight('#eee')
  al.position.set(0,0,0)
  SCENE.add(al)

  var l = new THREE.PointLight('#eee',10,100)
  l.position.set(0,0,0)
  SCENE.add(l)
}

Room.prototype.update = function() {
  var _this = this
  for (var i = 0; i < this.users.length; i++) {


    if(typeof this.removeUsersArray[this.users[i].id] !=  'undefined') {
        this.removeUser(this.users[i].id);
        continue;
    }

    if(typeof this.avatars[this.users[i].id] == 'undefined') {
      this.addAvatar(this.users[i])
    }

    this.moveUser(this.users[i])
  }
}

Room.prototype.addAvatar = function(user,callback) {
  var avatar = new Avatar(new THREE.Vector3(0,0,0),user.color)

  this.avatars[user.id] = avatar
  this.plan.add(this.avatars[user.id].mesh)

  if(typeof callback == 'function') {
    callback()
  }
}

Room.prototype.removeUser = function(userId) {

  for (var i = 0; i < this.plan.children.length; i++) {
    if(this.plan.children[i] == this.avatars[userId].mesh) {
      this.plan.remove(this.plan.children[i])
      break;
    }
  }

  delete this.avatars[userId]
  delete this.removeUsersArray[userId]

  for (var i = 0; i < this.users.length; i++) {
    if(this.users[i].id == userId) {
      this.users.splice(i,1);
      break;
    }
  }

}

Room.prototype.moveUser = function(user) {
    if(!user.mouse) {
        user.mouse = new THREE.Vector3(0,0,0)
    }

    if(!this.avatars[user.id]) return

    this.avatars[user.id].mesh.position.set(
      user.mouse.x,
      user.mouse.y,
      user.mouse.z
    )

}
