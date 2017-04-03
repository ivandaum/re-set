var App = function() {
	this.bindLinks();
}

App.prototype.bindLinks = function() {
	var links = document.querySelectorAll('.nav-ajax')
	for(var i=0; i<links.length; i++) {
		links[i].addEventListener('click',function(e) {
			e.preventDefault();
		})
	}
};