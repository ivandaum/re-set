class InteractionModel {
	constructor(db) {
		this.db = db
		this.args = {
			type: null,
			is_finish: null,
			room_id: null,
			people_required: null
		}
	}

	add(params, callback) {
		var date = new Date();
		params.updated_at = date.toString();
		params.created_at = date.toString();

		this.db.interactions.save(params, function (err, saved) {
			if (err || !saved) return false;

			if (typeof callback == 'function') {
				return callback(true);
			}

			return true;
		});
	}

	get(by) {
		this.db.interactions.find(by, function (errors, interactions) {
			if (errors || !interactions) return {};

			if (typeof callback == 'function') {
				return callback(interactions);
			}

			return interactions;
		});
	}
}
module.exports = InteractionModel;