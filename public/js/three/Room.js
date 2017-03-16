var Room = function(name) {
  this.plan = new THREE.Object3D()
  this.users = []
  this.avatars = []
  this.name = name
  this.removeUsersArray = []
  this.userHasJoin = true

  SCENE.add(this.plan)


  var al = new THREE.AmbientLight('#eee')
  al.position.set(0,0,0)
  SCENE.add(al)

  // var l = new THREE.PointLight('#fff',10,100)
  // l.position.set(0,0,5)
  // SCENE.add(l)
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

  if(this.users.length > 0) {
    this.userHasJoin = false
  }
}

Room.prototype.addAvatar = function(user,callback) {
  var position = new THREE.Vector3(0,0,0)
  if(user.mouse) position = user.mouse

  var avatar = new Avatar(user,position)

  this.avatars[user.id] = avatar
  this.plan.add(this.avatars[user.id].mesh)

  avatar.mesh.scale.set(0.01,0.01,0.01)
  if(typeof callback == 'function') {
    callback()
  }
}

Room.prototype.removeUser = function(userId) {
  this.avatars[userId].scale += (0.01 - this.avatars[userId].scale) * 0.2

  this.avatars[userId].mesh.scale.set(
    this.avatars[userId].scale,
    this.avatars[userId].scale,
    this.avatars[userId].scale
  )

  if(this.avatars[userId].scale > 0.01) return

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

    var avatar = this.avatars[user.id];
    if(!avatar) return

    if(avatar.scale <= 1) {
      avatar.scale += (1 - avatar.scale) * 0.1

      avatar.mesh.scale.set(
        avatar.scale,
        avatar.scale,
        avatar.scale
      )
    }

    var position = avatar.mesh.position

    if(this.userHasJoin) {
      position.x = user.mouse.x
      position.y = user.mouse.y
      return
    }


    position.x += (user.mouse.x - position.x) * 0.1
    position.y += (user.mouse.y - position.y) * 0.1


}
