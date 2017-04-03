module.exports = function(db) {
    this.db = db
    this.username = "";
    this.socket_id = null;
    this.interaction_id = null;

    this.add = function(params) {

        this.db.users.save({
            username:params.username,
            socket_id:params.socket_id,
            interaction_id:params.interaction_id
        }, function(err, saved) {

            if( err || !saved ) console.log("User not saved");
            else console.log("User saved");

        });

    }
}
