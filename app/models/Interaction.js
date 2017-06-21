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

	get(by,callback) {
		this.db.interactions.find(by, function (errors, interactions) {
			if (errors || !interactions) return {};
			if (typeof callback == 'function') {

				return callback(interactions);
			}

			return interactions;
		});
	}
	setIncomplete(by,callback) {
		var updateRow = {};
		var date = new Date();

		updateRow.is_finish = false;
		updateRow.updated_at = date.toString();

		this.db.interactions.update(by,{$set:updateRow},{ upsert: true,multi: true }, function (error, saved) {
			if (error) return {};

			if (typeof callback == 'function') {
				return callback(saved);
			}

			return true;
		});
	}
	setComplete(id,callback) {
		var updateRow = {};
		var date = new Date();

		updateRow.is_finish = true;
		updateRow.updated_at = date.toString();

		this.db.interactions.update({_id: id},{$set:updateRow}, function (error, saved) {
			if (error) return {};

			if (typeof callback == 'function') {
				return callback(saved);
			}

			return true;
		});
	}
}
module.exports = InteractionModel;
