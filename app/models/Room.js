class RoomModel {
	constructor(db) {
		this.db = db;
		this.args = {
			city_id: 1,
			is_finish: false,
			object: null
		}
	}

	add(params, callback) {
		var date = new Date();
		params.updated_at = date.toString();
		params.created_at = date.toString();

		this.db.rooms.save(params, function (err, saved) {
			if (err || !saved) console.log("not saved");

			if (typeof callback == 'function') {
				return callback(saved);
			}

			return true;
		});
	}

	update(roomId, update, callback) {

		var updateRow = {};

		if (update.city_id) {
			updateRow.city_id = update.city_id
		}

		if (update.is_finish) {
			updateRow.is_finish = update.is_finish
		}


		var date = new Date();
		params.updated_at = date.toString();


		// TODO : wrong method, need to be update. See app/models/Interaction.js
		// this.db.rooms.findOneAndUpdate({id: roomId}, updateRow, function (error, saved) {
		// 	if (errors || !rooms) return {};
		//
		// 	if (typeof callback == 'function') {
		// 		return callback(true);
		// 	}
		//
		// 	return true;
		// });


	}

	get(by, callback, sort) {
		this.db.rooms.find(by, function (errors, rooms) {
			if (errors || !rooms) return {};
			if (typeof callback == 'function') {
				return callback(rooms);
			}

			return rooms;
		})
	}

}
module.exports = RoomModel;
