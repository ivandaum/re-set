var UrlRewriting = {
	bind: function() {
		window.onpopstate = function(e) {
			console.log(e);
			e.preventDefault();
			if(e.state){
				console.log(e);
				document.getElementById("content").innerHTML = e.state.html;
				document.title = e.state.pageTitle;
			}
		};
	},
	setUrl: function(url) {
		window.history.pushState({},"", url);
	}
};