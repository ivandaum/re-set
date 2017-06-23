class InteractionModel {
  constructor(objectId,interaction) {
    this.objectId = objectId;
    this.users = [];
    this.people_required = interaction.people_required;
    this.room_id = interaction.room_id;
    this.position = interaction.position;
    this.canUpdateRoom = true; // flag to prevent lot a mongo request
  }
}

module.exports = InteractionModel;
