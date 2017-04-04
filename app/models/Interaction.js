var InteractionModel = function(db) {
    this.db = db
    this.args = {
      type:null,
      is_finish:null,
      room_id:null,
      people_required: null
    };
}

InteractionModel.prototype = {
  add:function(params,callback) {
      this.db.interactions.save(params, function(err, saved) {
          if( err || !saved ) return false;

          if(typeof callback == 'function') {
              return callback(true);
          }

          return true;
      });
  },
  get:function(by) {
      this.db.interactions.find(by, function(errors, interactions) {
          if( errors || !interactions) return {};

          if(typeof callback == 'function') {
              return callback(interactions);
          }

          return interactions;
      });
  }
}

module.exports = InteractionModel;
