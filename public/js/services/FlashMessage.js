class FlashMessage {
	constructor(msg,time) {
		this.container = document.querySelector("#flash-message");

		this.el = document.createElement("li");
		this.el.appendChild(document.createTextNode(msg));
		this.timelife = time * 1000
		this.show();
	}

	destroy() {

		this.el.remove();
	}

	show() {
		this.container.appendChild(this.el);
		var _this = this;

		setTimeout(function() {
			_this.destroy();
		},this.timelife)
	}
}