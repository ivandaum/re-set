var UserModel = function(socket) {

  function rand(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
  }
  this.room = null
  this.name = 'guest-'+socket.id
  this.id = socket.id
  this.color = {
    r:rand(30,255),
    g:rand(30,255),
    b:rand(30,255)
  }
}

UserModel.prototype.hasRoom = function() {
  return this.room != null
}
UserModel.prototype.get = function() {
    return {
      name:this.name,
      id:this.id,
      color:this.color
    }
}

module.exports = UserModel
