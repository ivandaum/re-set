var Transition = {
	homeToUsername: function() {
		var $container = document.querySelector('#home');
		new TweenMax.to($container,1,{transform:'translate(0,-100vh)', ease:Quart.easeInOut})
	},
	roomNav: {
		$menu: document.querySelector('.nav-room'),
		show: function() {
			new TweenMax.to(this.$menu,1,{opacity:1});
		},
		hide: function() {
			new TweenMax.to(this.$menu,1,{opacity:0});
		}
	}
};