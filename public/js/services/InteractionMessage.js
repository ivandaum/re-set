class InteractionMessage {
	constructor(type,userId,position) {
		this.parent = document.querySelector('.users-interactions');
		this.type = type;
		this.userId = userId;
		this.offset = {
			left:22,
			top:75
		};

		this.position = USER.threeToWindow(position);
		this.DOM = document.createElement('div');
		this.DOM.className = "user-interaction";
		this.DOM.innerHTML = document.querySelector('.btn-interaction[data-type="'+ type + '"]').innerHTML;
		this.parent.appendChild(this.DOM);

		this.DOM.style.top = (this.position.y - this.offset.top) + 'px';
		this.DOM.style.left = (this.position.x - this.offset.left) + 'px';

		this.justCreated = true;

		var _this = this;
		setTimeout(function() {
			_this.destroy();
		},2000);
		if(this.userId != USER.user.id) {
			SOUND.play({event:'interaction'});
		}

	}

	update() {

		if(!this.DOM) return;

		var user = null;
		for(let a=0; a<APP.ThreeEntity.users.length; a++) {
			user = APP.ThreeEntity.users[a];

			if(user.id == this.userId) {
				this.position = USER.threeToWindow(user.mouse);
				break;
			}
		}


		if(this.justCreated) {
			new TweenMax.to(this.DOM,0.2,{marginTop:0,opacity:1});
			this.justCreated = false;
		}
		var left = ((this.position.x - this.offset.left) - parseInt(this.DOM.style.left)) * 0.1;
		var top = ((this.position.y - this.offset.top)- parseInt(this.DOM.style.top)) * 0.1;

		this.DOM.style.left = (parseInt(this.DOM.style.left) + left) +'px';
		this.DOM.style.top = (parseInt(this.DOM.style.top) + top) + 'px';
	}

	destroy() {
		var _this = this;
		new TweenMax.to(this.DOM,0.5,{marginTop:'-25px',opacity:0,onComplete:function() {
			_this.DOM.remove();
			_this.DOM = false;
		}});
	}
}
