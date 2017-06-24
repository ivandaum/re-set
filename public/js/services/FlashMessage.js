class FlashMessage {
	constructor(data,time) {
		this.container = document.querySelector("#flash-message");
		this.content = "";

		this.el = document.createElement("li");
		this.timelife = time * 1000
		this.type = data.type;
		this.interaction = data.interaction;
		this.position = USER.InteractionPosToWindow(data.interaction.mesh);


		if(this.type == 'heavy') {
			this.content = this.tooHeavy(data.number);
			this.el.className = 'too-heavy';
			this.el.style.left = 'calc(' + this.position.x + 'px - 1.5rem)';
			this.el.style.top = 'calc(' + this.position.y+ 'px - 3.5rem)';
		} else {
			this.content = data.msg;
		}
		this.el.innerHTML = this.content;
		this.show();
		new TutorialMessage({type:'heavy',position:this.position,number:data.number})
	}

	destroy() {
		this.el.remove();
		this.el = false;
	}

	tooHeavy(number) {
		return '<p>'+number+'</p><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 107 107"><polygon points="100.03 80.24 53.81 106.93 7.59 80.24 7.59 26.88 53.81 0.19 100.03 26.88 100.03 80.24"/></svg>';
	}

	show() {
		var _this = this;
		_this.el.style.opacity = 0;
		this.container.appendChild(this.el);
		new TweenMax.fromTo(_this.el,0.3,{marginTop:'10px',opacity:0},{marginTop:'0',opacity:1,onComplete:function() {
			setTimeout(function() {
				new TweenMax.fromTo(_this.el,0.5,{marginTop:'0px',opacity:1},{marginTop:'-10px',opacity:0,onComplete:function() {
					_this.destroy()
				}});
			},_this.timelife)
		}});
	}
}
