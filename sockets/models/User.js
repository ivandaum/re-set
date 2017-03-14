var UserModel = function(socket) {
  this.name = 'guest-'+socket.id
  this.id = socket.id
}

UserModel.prototype.get = function() {
    return {
      name:this.name,
      id:this.id
    }
}

module.exports = UserModel
