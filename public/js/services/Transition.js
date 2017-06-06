var Transition = {
	isScrolling:false,
	clickOnDraggable:false,
	homeToUsername: function() {

		if(Transition.isScrolling) return;

		Transition.isScrolling = true;

		var $container = document.querySelector('#home');
		new TweenMax.to($container,1,{transform:'translate(0,-100vh)', ease:Quart.easeInOut})
	},
	movesDraggable: function(e) {
		var top = document.querySelector('.enter-reset').getBoundingClientRect().top;
		var draggableHeight = document.querySelector('.draggable').offsetHeight;
		var px = e.clientY-top - (draggableHeight/2);

		if(px < 0 ) return;
		if(px > 150) return;

		var percent = px / 150;
		if(percent >= 0.95) {
			Navigator.canGoToMap = true;
		} else {
			Navigator.canGoToMap = false;
		}

		new TweenMax.to('.draggable',0.3,{transform:'translate(0,' + px + 'px)'});
		new TweenMax.to('.draggable-background, .draggable-ending',0.3,{opacity:1-percent})
	},
	draggableToZero: function() {

		new TweenMax.to('.draggable',1,{transform:'translate(0,0px)',ease:Quint.easeInOut});
		new TweenMax.to('.draggable-background, .draggable-ending',1,{opacity:1,ease:Quint.easeInOut})
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