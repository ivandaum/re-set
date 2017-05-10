var model = require("../../config/db");

class UserModel {
  constructor(socket) {
    function rand(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }

    this.room = null;
    this.name = model.DEFAULT_NICKNAME;
    this.id = socket.id;
    this.color = {
      r: rand(20, 255),
      g: rand(20, 255),
      b: rand(20, 255)
    };

    this.mouse = {
      x: 0,
      y: 0,
      z: 0
    }
  }
  hasRoom() {
    return this.room != null;
  }
  get() {
    return {
      name: this.name,
      id: this.id,
      color: this.color,
      room: this.room
    }
  }
}

module.exports = UserModel;
