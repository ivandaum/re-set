module.exports = function(db) {
  this.db = db
  this.city_id = 1;
  this.is_finish = false;

  this.add = function(city_id,is_finish) {
    this.db.rooms.save({
      city_id:city_id,
      is_finish:is_finish
    }, function(err, saved) {

      if( err || !saved ) console.log("not saved");
      else console.log("saved");

    });
  }

  this.update = function(update) {

    var updateRow = {}

    if(update.city_id) {
      updateRow.city_id = update.city_id
    }

    if(update.is_finish) {
      updateRow.is_finish = update.is_finish
    }

    this.db.rooms.update(updateRow, function(err, saved) {

      if( err || !saved ) console.log("not saved");
      else console.log("saved");

    });
  }

  this.get = function(getBy) {
    this.db.rooms.find(getBy, function(err, rooms) {

      if( err || !rooms) console.log("No rooms");
      else rooms.forEach( function(room) {
        console.log(room);
      });

    });
  }
}
