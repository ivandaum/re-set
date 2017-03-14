var UserModel = function(socket) {
  this.name = 'guest-'+socket.id
  this.id = socket.id
}

UserModel.prototype.get = function(attr) {
  if(this[attr]) return this.attr
}

module.exports = UserModel
