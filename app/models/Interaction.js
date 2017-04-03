module.exports = function(db) {
    this.db = db
    this.type = null;
    this.is_finish = null;
    this.room_id = null;

    this.add = function(city_id,is_finish) {
        this.db.interactions.save({
            city_id:city_id,
            is_finish:is_finish
        }, function(err, saved) {

            if( err || !saved ) console.log("not saved");
            else console.log("saved");

        });
    }

    this.update = function(interactionId,update) {
        var updateRow = {}

        if(update.room_id) {
            updateRow.room_id = update.room_id
        }

        if(update.is_finish) {
            updateRow.is_finish = update.is_finish
        }

        this.db.interactions.findOneAndUpdate({id:interactionId},updateRow, function(err, saved) {

            if( err || !saved ) console.log("not saved");
            else console.log("saved");

        });
    }

    this.get = function(getBy) {
        this.db.interactions.find(getBy, function(err, rooms) {

            if( err || !rooms) console.log("No interactions");
            else rooms.forEach( function(room) {
                console.log(room);
            });

        });
    }
}
