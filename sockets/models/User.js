var model = require("../../config/db");

class UserModel {
  constructor(socket) {
    function rand(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }

    this.room = null;
    this.name = model.DEFAULT_NICKNAME;
    this.id = socket.id;
    let color = this.lerpColor('#c93c22','#008cec',rand(0,100)/100);
    this.color = this.hexToRgb(color);

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
  lerpColor(a, b, amount) {

      var ah = parseInt(a.replace(/#/g, ''), 16),
          ar = ah >> 16, ag = ah >> 8 & 0xff, ab = ah & 0xff,
          bh = parseInt(b.replace(/#/g, ''), 16),
          br = bh >> 16, bg = bh >> 8 & 0xff, bb = bh & 0xff,
          rr = ar + amount * (br - ar),
          rg = ag + amount * (bg - ag),
          rb = ab + amount * (bb - ab);

      return '#' + ((1 << 24) + (rr << 16) + (rg << 8) + rb | 0).toString(16).slice(1);
  }
  hexToRgb(hex) {
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
      } : null;
  }


}

module.exports = UserModel;
