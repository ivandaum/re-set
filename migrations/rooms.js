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

 function rand(min,max) {
   return Math.floor(Math.random()*(max-min+1)+min);
 }
//rand(0,1) == 1 ? true :
var rooms = [];

for (var i = 0; i < 520; i++) {
	var roomObj = rand(2,3);

	rooms.push({
		city_id:1,
		object:roomObj,
		is_finish:false,
    stats: {
      started_at:null,
      click:0,
      msg:0
    },
		interactions: [
			{
				people_required:1,
				position: {x: 24, y: 34, z: 84},
				type:1,
				is_finish:false,
				percent_progression:12,
        obstacles_order:1
			},
			{
				people_required:2,
				position: {x: 54, y: 64, z: 56},
				type:2,
				is_finish:false,
				percent_progression:33,
        obstacles_order:2,
			},
			{
				people_required:2,
				position: {x: 104, y: 16, z: 50},
				type:3,
				is_finish:false,
				percent_progression:72,
        obstacles_order:3
			}

		],

	})
}
module.exports = rooms;
