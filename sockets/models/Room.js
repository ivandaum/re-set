var RoomModel = function(name) {
  this.name = name
}

RoomModel.prototype.get = function() {
    return {
      name:this.name
    }
}

module.exports = RoomModel
