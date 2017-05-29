/**
 *  fill rooms with a room{} array
 *
 *  ROOM:
 *
 *  @city_id:(INT) city's id (only 1 for the moment, in case of we add futurs cities)
 *  @object: (INT) the 3D model on the room, imported in /public/object/rooms/
 *  @is_finish: (BOOL) If not specified, is_finish = false. [OPTIONAL]
 *  @interactions: (ARRAY) array of interactions object for the room
 *
 *
 *  INTERACTION:
 *
 *  @people_required: (INT) number of people for finishing the interaction
 *  @position: (OBJECT) an object with the x,y,z position for the object
 *  @type: the type of interaction imported in /public/object/interactions
 *  @is_finish: (BOOL) If not specified, is_finish = false. [OPTIONAL]
 *  @percent_progression: (INT) required to know how much the tube need to be update if the interaction is completed
 */

var rooms = [
	{
		city_id:1,
		object:1,
		is_finish:false,
		interactions: [
			{
				people_required:3,
				position: {
					x:0,
					y:0,
					z:0
				},
				type:1,
				is_finish:false,
				percent_progression:60
			},{
				people_required:1,
				position: {
					x:0,
					y:35,
					z:-20
				},
				type:2,
				is_finish:false,
				percent_progression:30
			}
		],

	},
	{
		city_id:1,
		object:1,
		is_finish:false,
		interactions: [
			{
				people_required:3,
				position: {
					x:0,
					y:0,
					z:0
				},
				type:1,
				is_finish:false,
				percent_progression:60
			},{
				people_required:2,
				position: {
					x:0,
					y:35,
					z:-20
				},
				type:2,
				is_finish:false,
				percent_progression:30
			}
		],

	}



];

module.exports = rooms;
