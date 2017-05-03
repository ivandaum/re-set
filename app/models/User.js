class UserModel {
	constructor(db) {
		this.db = db;
		this.args = {
			username: "",
			is_finish: false
		}
	}

	add(params, callback) {

		this.db.users.save(params, function (err, saved) {
			if (err || !saved) console.log("not saved");

			if (typeof callback == 'function') {
				return callback(true);
			}

			return true;
		});
	}

	get(by) {
		this.db.users.find(by, function (errors, rooms) {
			if (errors || !rooms) return {};

			if (typeof callback == 'function') {
				return callback(rooms);
			}

			return rooms;
		});
	}
}


module.exports = UserModel;
