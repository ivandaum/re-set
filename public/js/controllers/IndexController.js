var IndexController = function() {

	document.querySelector('#home').style.display = 'block';
	return this;
};

IndexController.prototype = {
	jumpToMap: function() {
		var name = "Guest";
		USER.changeName(name,function() {
			USER.enter('map');
		});
	}
};
