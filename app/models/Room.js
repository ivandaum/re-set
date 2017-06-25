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

	setComplete(data,callback) {
		var updateRow = {};
		var date = new Date();
		var id = data.id;
		updateRow.is_finish = true;
		updateRow.updated_at = date.toString();

		updateRow.stats = {
			started_at: data.stats.started_at,
			msg:data.stats.msg,
			click: data.stats.click
		};
		console.log(updateRow);
		this.db.rooms.update({_id: id},{$set:updateRow}, function (error, saved) {
			if (error) return {};

			if (typeof callback == 'function') {
				return callback(saved);
			}

			return true;
		});
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
