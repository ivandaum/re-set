class IndexController {
	constructor() {
		IndexController
	}

	jumpToMap() {
		var name = "Guest";
		USER.changeName(name,function() {
			USER.enter('map');
		});
	}
}
