class FlashMessage {
	constructor(data,time) {
		this.container = document.querySelector("#flash-message");

		this.el = document.createElement("li");
		this.timelife = time * 1000
		this.type = data.type;

		let content = "";

		if(this.type == 'heavy') {
			content = this.tooHeavy(data.number);
			this.el.className = 'too-heavy';
			this.el.style.left = data.position.x + 'px';
			this.el.style.top = data.position.y + 'px';
		} else {
			content = data.msg;
		}
		this.el.innerHTML = content;
		this.show();
		// this.container.appendChild(this.el);
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
		new TweenMax.fromTo(_this.el,0.2,{marginTop:'25px',opacity:0},{marginTop:'0',opacity:1,onComplete:function() {
			setTimeout(function() {
				new TweenMax.fromTo(_this.el,0.2,{opacity:1},{opacity:0,onComplete:function() {
					_this.destroy()
				}});
			},_this.timelife)
		}});
	}
}
