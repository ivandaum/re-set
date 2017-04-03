var InteractionModel = function(db) {
    this.db = db
    this.type = null;
    this.is_finish = null;
    this.room_id = null;
    this.people_required = null;
}

InteractionModel.prototype.add = function(params,callback) {
    this.db.interactions.save(params, function(err, saved) {
        if( err || !saved ) return false;

        if(typeof callback == 'function') {
            return callback(true);
        }

        return true;
    });
};

InteractionModel.prototype.get = function(by) {
    this.db.interactions.find(by, function(errors, interactions) {
        if( errors || !interactions) return {};

        if(typeof callback == 'function') {
            return callback(interactions);
        }

        return interactions;
    });
};

InteractionModel.prototype.getAll = function(roomId,callback) {
    this.db.interactions.find({}, function(errors, interactions) {
        if( errors || !rooms) return {};
        if(typeof callback == 'function') {
            return callback(interactions);
        }

        return interactions;
    })
}

module.exports = InteractionModel;
