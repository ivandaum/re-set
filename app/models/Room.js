var RoomModel = function(db) {
  this.db = db;
  this.args = {
    city_id:1,
    is_finish: false,
    type: null
  }
};

RoomModel.prototype = {
  add:function(params,callback) {

    this.db.rooms.save(params, function(err, saved) {
      if( err || !saved ) console.log("not saved");

      if(typeof callback == 'function') {
        return callback(true);
      }

      return true;
    });
  },
  update: function(roomId,update,callback) {

    var updateRow = {}

    if(update.city_id) {
      updateRow.city_id = update.city_id
    }

    if(update.is_finish) {
      updateRow.is_finish = update.is_finish
    }

    this.db.rooms.findOneAndUpdate({id:roomId},updateRow, function(error, saved) {
      if( errors || !rooms) return {};

      if(typeof callback == 'function') {
        return callback(true);
      }

      return true;
    });
  },
  get:function(by,callback) {
    this.db.rooms.find(by, function(errors, rooms) {
      if( errors || !rooms) return {};
      if(typeof callback == 'function') {
        return callback(rooms);
      }

      return rooms;
    })
  }
};

module.exports = RoomModel;