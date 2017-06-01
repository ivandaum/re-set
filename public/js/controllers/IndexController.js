class IndexController {
	constructor() {

	}

	jumpToMap() {
		var name = "Ivan";
		USER.changeName(name,function() {
			USER.enter('map');
		});
	}
}
