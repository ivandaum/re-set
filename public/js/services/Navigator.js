var Navigator = {
	canGoToMap: false,
	usernameError: false,
	previousStart:'',
	init: function() {
		var _this = this;
		this.home();
		// document.querySelector('.home-start .submit-username').addEventListener('click', function(e) {
		// 	e.preventDefault();
		// 	_this.validateHomeUsername();
		// });

		// NAVIG THROUGHT PARTS
		var links = document.querySelectorAll('.navigator-link');
		for(var e=0; e<links.length; e++) {
			this.bindNavigatorLink(links[e]);
		}

		document.querySelector('.close-about').addEventListener('click',function() {
				Transition.about.hide();
				if(hasClass(document.querySelector('.btn-ui.about'),'active')) {
					removeClass(document.querySelector('.btn-ui.about'),'active');
				}
				USER.freezeThree = false;
		});

		document.querySelector('.btn-ui.sound').addEventListener('click',function() {
			if(hasClass(this,'mute')) {
				removeClass(this,'mute');
				SOUND.mute(false);
			} else {
				addClass(this,'mute');
				SOUND.mute(true);
			}
		});

		var aboutDot = document.querySelectorAll('#about .dots-menu li');
		for (let i = 0; i < aboutDot.length; i++) {
			aboutDot[i].addEventListener('click',Transition.about.switchSection);
		}
		document.querySelector('.btn-ui.about').addEventListener('click', function() {

				if(hasClass(this,'active')) {
					removeClass(this,'active');
					Transition.about.hide();
				} else {
					addClass(this,'active');
					Transition.about.show();
					USER.freezeThree = true;
				}
		});

		document.querySelector('#result-box .enter-reset button').addEventListener('click',function() {
			var name = document.querySelector('#result-box .user-new-name').value;

			if(Navigator.usernameError) {
				return;
			}

			if(name.length <= 0) {

				var error = document.querySelector('#result-box .errors');
				var errorValidator = document.querySelector('#result-box .error');
				var valideValidator = document.querySelector('#result-box .validated');

				error.innerHTML = 'Name cannot be empty';
				errorValidator.style.display = 'block';
				valideValidator.style.display = 'none';
				Navigator.usernameError = false;
				return
			}

			USER.changeName(name,function() {
				USER.addContribution();
			});
		});


		var interactionsButtons = document.querySelectorAll('.btn-interaction');
		for(let a=0; a<interactionsButtons.length; a++) {
			interactionsButtons[a].addEventListener('click',function() {
				var type = this.dataset.type;
				if(type) {
					socket.emit('send:interaction',type);
				}

			});
		}

		// SHOW SHARER
		var sharerUrl = document.querySelector('.sharer');
		sharerUrl.addEventListener('click', function() {
				if(hasClass(document.querySelector('.share-room'),'active')) {
						removeClass(document.querySelector('.share-room'),'active');
				} else {
						addClass(document.querySelector('.share-room'),'active');
				}
		})

		var sharers = document.querySelectorAll('a.sharer');
		for (var i = 0; i < sharers.length; i++) {
			sharers[i].addEventListener('click',function(e) {
				e.preventDefault();
				let link = this.href + window.location.href;

				if(hasClass(this,'twitter')) {
					link += '&text=I%20need%20help%20to%20relight%20the%20world!%20Join%20me!%20#Reset%20#Experiment'
				}
				window.open(link, "", "width=500,height=400");
			});
		}


		// COPY CURRENT ROOM
		// var copyUrl = document.querySelector('.copy-url');
		// copyUrl.addEventListener('click', function() {
		// 	var url = document.querySelector('.current-url').innerHTML = window.location.href;
		// 	Copied = url.getSelection();
		// 	var test = document.execCommand("Copy",true,window.location.href);
		//
		// });
	},
	home: function() {
		var _this = this;
		// SCROLL TU USERNAME PART

		document.querySelector('.home-to-start').addEventListener('click', Transition.homeToUsername);

		// SUBMIT USERNAME
		let $usernames = document.querySelectorAll('.user-new-name');
		for(let p=0; p<$usernames.length; p++) {
			$usernames[p].addEventListener('keyup',function(e) {
				var name = this.value;
				var parent = this.parentNode;
				var error = parent.querySelector('.errors');
				var errorValidator = parent.querySelector('.error');
				var valideValidator = parent.querySelector('.validated');

				if(name.length > 10) {
					error.innerHTML = '10 letters maximum';
					errorValidator.style.display = 'block';
					valideValidator.style.display = 'none';
					_this.usernameError = true;
				} else if(name.match(/[^a-z\d]+/i)) {
					error.innerHTML = 'No special characters or space';
					errorValidator.style.display = 'block';
					valideValidator.style.display = 'none';
					_this.usernameError = true;
				} else if (name.length < 2) {
					error.innerHTML = '2 letters minimum';
					errorValidator.style.display = 'block';
					valideValidator.style.display = 'none';
					_this.usernameError = true;
				} else {
					error.innerHTML = '';
					errorValidator.style.display = 'none';
					valideValidator.style.display = 'block';
					_this.usernameError = false;
				}
			});

		}
		document.querySelector('#home').addEventListener('mousewheel', Transition.homeToUsername);
		document.querySelector('#home').addEventListener('wheel', Transition.homeToUsername);

		document.querySelector('#home .draggable').addEventListener('mousedown', function(e) {
			Transition.clickOnDraggable = true;
		});

		document.addEventListener('mouseup', function(e) {
			if(isNull(APP)) return;

			if(APP.section == 'username') {
				Transition.draggableToZero();
				Navigator.canGoToMap = false;
				Transition.clickOnDraggable = false;
			}
		});

		document.addEventListener('mousemove', function(e) {

			if(Navigator.canGoToMap) {
				if(Navigator.validateHomeUsername()) {
					Navigator.canGoToMap = false;
					Transition.clickOnDraggable = false;
				}
			}

		});

		document.addEventListener('mousemove', function(e) {
			if(Transition.clickOnDraggable) {
				Transition.movesDraggable(e);
			}
		});
	},

	bindBackButton: function() {
		window.onpopstate = function(e) {
			e.preventDefault();
			if(e.state){
				console.log(e);
				document.getElementById("content").innerHTML = e.state.html;
				document.title = e.state.pageTitle;
			}
		};
	},
	goTo: function(div) {
		var target = document.querySelector('#' + div);

		if(target) {
			var containers = document.querySelectorAll('section.container');
			for(var e=0; e<containers.length; e++) {
				containers[e].style.display = 'none';
			}
			target.style.display = 'block';
		}
	},
	setUrl: function(url) {

		if(url == '/') {
			Transition.roomNav.hide();
		} else {
			Transition.roomNav.show();
		}

		if(window.location.pathname != url) {
			window.history.pushState({},"", url);
		}
	},
	validateHomeUsername: function(name) {
		name = name || document.querySelector('.home-start .user-new-name').value;

		if(this.usernameError) {
			return false;
		}

		if(name.length <= 0) {
			var error = document.querySelector('#home .errors');
			error.innerHTML = 'Name cannot be empty';
			document.querySelector('.input-validator .error').style.display = 'block';
			document.querySelector('.input-validator .validated').style.display = 'none';
			this.usernameError = false;
			return false;
		}


		if(!Transition.canScroll) return;
		Transition.canScroll = false;

		USER.changeName(name,function() {
			LOADER.init(function() {
				Navigator.homePercentScrolled = 100;
				USER.leave(function() {
					USER.enter('map');
				});
			});
		});

		return true;
	},
	bindNavigatorLink: function(link) {
		var _this = this;
		link.addEventListener('click',function(e) {
			var target = this.dataset.target;

			if(!target) {
				console.log('No data-target specified.');
				return false;
			}

			if(target == "home") {
				USER.leave();
			}

			if(USER.room && target == 'map') {
				SOUND.play({event:'zoom'});
				Transition.zoomToMap(function() {
					USER.leave(function() {
						USER.enter('map');
					});
				})
			}

			let $el = document.querySelector('.interactions');
			if(hasClass($el,'active') && USER.room != "map") {
				USER.sendMouseMovement = true;
				removeClass($el,'active');
				new TweenMax.to('.interactions .btn-interaction',0.2, {opacity:0});
			}

			Navigator.goTo(target);
			Navigator.setUrl('/');
		});
	}
};
