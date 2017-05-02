var Navigator = {
	init: function() {
		var _this = this;

		// NAVIG THROUGHT PARTS
		var links = document.querySelectorAll('.navigator-link');
		for(var e=0; e<links.length; e++) {
			links[e].addEventListener('click',function() {
				var target = this.dataset.target;

				if(!target) {
					console.log('No data-target specified.');
					return false;
				}

				if(USER.room && target == "home") {
					USER.leave();
				}

				_this.roomPanel.hide();

				Navigator.goTo(target);
				_this.setUrl('/');
			});

		}

		// NAVIG TO MAP
		var mapLinks = document.querySelectorAll('.navigator-map');
		for(var a=0; a<mapLinks.length; a++) {
			mapLinks[a].addEventListener('click', function() {
				USER.leave(function() {
					USER.enter('map');
				});
			})
		}

		// SUBMIT USERNAME
		var input = document.querySelector('.user-new-name');
		input.addEventListener('keydown',function(e) {

			// Key : enter
			if(e.which != 13) return;

			var name = document.querySelector('.user-new-name').value;
			USER.changeName(name,function() {
				USER.enter('map');
			});
		});


		var helpRequest = document.querySelector('.send-help');
		helpRequest.addEventListener('click', function() {
			if(USER.canSendHelp) {
				socket.emit('send:help_request');
				USER.canSendHelp = false;
			}
		});

		this.roomPanel.hide();

	},
	goTo: function(div) {
		var target = document.querySelector('#' + div);

		if(target) {
			var containers = document.querySelectorAll('.container');
			for(var e=0; e<containers.length; e++) {
				containers[e].style.display = 'none';
			}
			target.style.display = 'block';
		}
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
	setUrl: function(url) {

		if(window.location.pathname != url) {
			window.history.pushState({},"", url);
		}
	},
	roomPanel: {
		el: document.querySelector('#room-menu'),
		show: function() {
			this.el.style.display = "block";
		},
		hide: function() {
			this.el.style.display = "none";
		}
	}
};