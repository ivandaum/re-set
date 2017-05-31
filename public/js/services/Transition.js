var Transition = {
	homeToUsername: function() {
		var $container = document.querySelector('#home');
		new TweenMax.to($container,1,{transform:'translate(0,-100vh)', ease:Quart.easeInOut})
	}
};