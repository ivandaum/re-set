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

	get(by,callback) {
		this.db.users.find(by, function (errors, users) {
			if (errors || !users) return {};

			if (typeof callback == 'function') {
				return callback(users);
			}

			return users;
		});
	}
}


module.exports = UserModel;
