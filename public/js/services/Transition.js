var Transition = {
	canScroll:true,
	clickOnDraggable:false,
	homePercentScrolled: 0,
	homeToUsername: function(e) {
		if(!Transition.canScroll) return;

		Transition.canScroll = false;
		APP.scrollingToUsername = true;
		var $container = document.querySelector('#home');

		if(e.deltaY > 0) {
			new TweenMax.to($container,1,{transform:'translate(0,-100vh)', ease:Quart.easeInOut})
			new TweenMax.to(APP.ThreeEntity.plan.position,1.5,{y:INITIAL_CAMERA,ease:Quart.easeInOut})
			if(hasClass(document.querySelector('.go-home'),'disable')) {
				removeClass(document.querySelector('.go-home'),'disable');
			}
			APP.section = "username";
		} else {
			if(!hasClass(document.querySelector('.go-home'),'disable')) {
				addClass(document.querySelector('.go-home'),'disable');
			}
			new TweenMax.to($container,1,{transform:'translate(0,0vh)', ease:Quart.easeInOut})
			new TweenMax.to(APP.ThreeEntity.plan.position,1,{y:0,ease:Quart.easeInOut,delay:0.2});

			APP.section = "intro";
		}

		setTimeout(function() {
			Transition.canScroll = true;
		},1000);
	},
	movesDraggable: function(e) {
		var top = document.querySelector('.enter-reset').getBoundingClientRect().top;
		var draggableHeight = document.querySelector('.draggable').offsetHeight;
		var px = e.clientY-top - (draggableHeight/2);

		if(px < 0 ) return;
		if(px > 150) return;

		this.homePercentScrolled = px / 150;

		if(this.homePercentScrolled >= 0.95) {
			Navigator.canGoToMap = true;
		} else {
			Navigator.canGoToMap = false;
		}

		APP.ThreeEntity.animateBeforeEnter(this.homePercentScrolled);

		new TweenMax.to(APP.ThreeEntity.plan.position,0.2,{y:INITIAL_CAMERA+(INITIAL_CAMERA*this.homePercentScrolled)});
		new TweenMax.to('.draggable',0.3,{transform:'translate(0,' + px + 'px)'});
		new TweenMax.to('.draggable-background, .draggable-ending',0.3,{opacity:1-this.homePercentScrolled})
	},
	draggableToZero: function() {
		if(!Transition.canScroll) return;
		this.homePercentScrolled = 0;
		new TweenMax.to('.draggable',1,{transform:'translate(0,0px)',ease:Quint.easeInOut});
		new TweenMax.to('.draggable-background, .draggable-ending',1,{opacity:1,ease:Quint.easeInOut});
		new TweenMax.to(APP.ThreeEntity.plan.position,1.5,{y:INITIAL_CAMERA,ease:Quart.easeInOut});
	},
	draggableToEnd: function() {
		this.homePercentScrolled = 100;
		if(!Transition.canScroll) return;
		new TweenMax.to('.draggable',1,{transform:'translate(0,150px)',ease:Quint.easeInOut});
		new TweenMax.to('.draggable-background, .draggable-ending',1,{opacity:0,ease:Quint.easeInOut});
		new TweenMax.to(APP.ThreeEntity.plan.position,1.5,{y:INITIAL_CAMERA*2,ease:Quart.easeInOut});
	},
	zoomToMesh: function(mesh, callback) {
			USER.canMouveCamera = false;
			let pos = new THREE.Vector3(mesh.position.x,mesh.position.y,mesh.position.z);

			var startRotation = new THREE.Euler().copy( CAMERA.rotation );
			CAMERA.lookAt({x:pos.x,y:pos.y,z:pos.z});
			var endRotation = new THREE.Euler().copy( CAMERA.rotation );
			CAMERA.rotation.copy( startRotation );

			setTimeout(function() {
							document.querySelector('#app').style.opacity = 0;
			},1000);
			new TweenMax.to(CAMERA.position,4,{ease:Quart.easeInOut,x:pos.x,y:pos.y,z:pos.z,onUpdate: function() {
					pos.x += CLOCK.getElapsedTime()/10;
			},onComplete: function() {
					if(isFunction(callback)) {
						document.querySelector('#app').style.opacity = 1;
						callback();
						USER.canMouveCamera = true;
					}
			}});
			new TweenMax.to(startRotation,3,{ease:Quart.easeInOut,x:endRotation.x,y:endRotation.y,z:endRotation.x,onUpdate:function() {
				CAMERA.rotation.copy( startRotation );
			}});
			return;
			// // backup original rotation
			// var startRotation = new THREE.Euler().copy( CAMERA.rotation );
			//
			// // final rotation (with lookAt)
			// CAMERA.lookAt({x:pos.x,y:pos.y,z:pos.z});
			// var endRotation = new THREE.Euler().copy( CAMERA.rotation );
			//
			// CAMERA.rotation.copy( startRotation );
			// new TweenMax.to(CAMERA,1, { rotation: endRotation });
	},
	roomNav: {
		$menu: document.querySelector('.nav-room'),
		show: function() {
			if(!hasClass(document.querySelector('.go-home'),'disable')) {
				addClass(document.querySelector('.go-home'),'disable');
			}
			if(hasClass(this.$menu,'disable')) {
				removeClass(this.$menu,'disable');
			}
		},
		hide: function() {
			if(hasClass(document.querySelector('.go-home'),'disable')) {
				removeClass(document.querySelector('.go-home'),'disable');
			}

			if(!hasClass(this.$menu,'disable')) {
				addClass(this.$menu,'disable');
			}
		}
	}
};
