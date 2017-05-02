class HelpRequest {
	constructor(roomId, userId) {
		this.roomId = roomId;
		this.userId = userId;
	}

	get() {
		return {
			roomId: this.roomId,
			userId: this.userId
		}
	}
}

module.exports = HelpRequest;
