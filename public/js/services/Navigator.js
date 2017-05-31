var Navigator = {
	init: function() {
		var _this = this;

		// SCROLL TU USERNAME PART
		document.querySelector('.home-to-start').addEventListener('click', Transition.homeToUsername);

		// SUBMIT USERNAME
		document.querySelector('.home-start .user-new-name').addEventListener('keydown',function(e) {
			// if Key != enter
			if(e.which != 13) return;

			_this.validateHomeUsername();
		});
		document.querySelector('.home-start .submit-username').addEventListener('click', function(e) {
			e.preventDefault();
			_this.validateHomeUsername();
		});

		// NAVIG THROUGHT PARTS
		var links = document.querySelectorAll('.navigator-link');
		for(var e=0; e<links.length; e++) {
			this.bindNavigatorLink(links[e]);
		}

		var changePseudo = document.querySelector('#username-box .user-new-name');
		changePseudo.addEventListener('keydown',function(e) {

			// Key : enter
			if(e.which != 13) return;
			var name = document.querySelector('#username-box .user-new-name').value;

			USER.changeName(name,function() {
				USER.addContribution();
			});
		});

		// SEND HELP
		// var helpRequest = document.querySelector('.send-help');
		// helpRequest.addEventListener('click', function() {
		// 	if(USER.canSendHelp) {
		// 		socket.emit('send:help_request');
		// 		USER.canSendHelp = false;
		// 	}
		// });


		// SHOW SHARER
		// var sharerUrl = document.querySelector('.sharer');
		// sharerUrl.addEventListener('click', function() {
		// 	var display = document.querySelector('.share-url').style.display;
		//
		// 	if(display == 'block') {
		// 		display = "none";
		// 	} else {
		// 		display = "block"
		// 	}
		//
		// 	document.querySelector('.share-url').style.display = display;
		// })


		// COPY CURRENT ROOM
		// var copyUrl = document.querySelector('.copy-url');
		// copyUrl.addEventListener('click', function() {
		// 	var url = document.querySelector('.current-url').innerHTML = window.location.href;
		// 	Copied = url.getSelection();
		// 	var test = document.execCommand("Copy",true,window.location.href);
		//
		// });
	},
	bindBackButton: function() {
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
	goTo: function(div) {
		var target = document.querySelector('#' + div);

		if(target) {
			var containers = document.querySelectorAll('section');
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
	validateHomeUsername: function() {
		var name = document.querySelector('.home-start .user-new-name').value;
		USER.changeName(name,function() {
			USER.enter('map');
		});
	},
	bindNavigatorLink: function(link) {
		link.addEventListener('click',function() {
			var target = this.dataset.target;

			if(!target) {
				console.log('No data-target specified.');
				return false;
			}

			if(USER.room && target == "home") {
				USER.leave();
			}

			if(USER.room && target == 'map') {
				USER.leave(function() {
					USER.enter('map');
				});
			}

			Navigator.goTo(target);
			Navigator.setUrl('/');
		});
	}
};