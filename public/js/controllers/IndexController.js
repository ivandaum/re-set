class IndexController {
	constructor() {

	}

	jumpToMap() {
		var name = "Guest";
		USER.changeName(name,function() {
			USER.enter('map');
		});
	}
}
