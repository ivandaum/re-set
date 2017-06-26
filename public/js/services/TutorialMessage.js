class TutorialMessage {
  constructor(data) {

      if(notNull(Cookies.get('tutorial-' + data.type))) return false;

      this.container = document.querySelector("#flash-message");
      this.el = document.createElement("li");
      this.el.className = "tutorial"
      this.type = data.type;
      this.position = data.position;
      this.content = "";

      if(this.type == 'heavy') {
        this.el.className += ' heavy';
        this.content = this.tooHeavy(data.number);

        this.el.style.left = 'calc(' + this.position.x + 'px + 6rem)';
        this.el.style.top = 'calc(' + this.position.y + 'px - 3rem)';

      } else if (this.type == 'help') {
        this.el.className += ' help';
        this.content = this.help();

        this.el.style.left = 'calc(' + this.position.x + 'px - 12rem)';
        this.el.style.top = 'calc(' + this.position.y + 'px + 10rem)';

      } else if (this.type = 'intro') {
        this.el.className += ' intro';
        this.content = this.intro();
        this.el.style.left = 'calc(' + this.position.x + 'px - 12rem)';
        this.el.style.top = 'calc(' + this.position.y + 'px + 10rem)';
      }


  		this.el.innerHTML = this.content;

      Cookies.set('tutorial-' + this.type,'true');

  		this.show();
  }

  destroy() {
    var _this = this;

		new TweenMax.fromTo(this.el,0.5,{marginTop:'0px',opacity:1},{marginTop:'-10px',opacity:0,onComplete: function() {
  		_this.el.remove();
  		_this.el = false;
    }});
	}

  tooHeavy(number) {
    let content = "";
    content += "<div class='picto'><p>"+number+"</p><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 107 107'><polygon points='100.03 80.24 53.81 106.93 7.59 80.24 7.59 26.88 53.81 0.19 100.03 26.88 100.03 80.24'/></svg></div>";
    content += '<p>Too heavy?<br /> Need ' + number  + ' players</p>';

    return content;
  }

  help() {
    let content = "";

    content += "<div class='picto'><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 54.49 20.24'><title>help_switch</title><path d='M43.35,18.23h-.07a8.08,8.08,0,0,1-3-1,.5.5,0,0,1,.5-.86,7.09,7.09,0,0,0,2.64.9.5.5,0,0,1-.06,1Zm4.83-.95a.5.5,0,0,1-.25-.93A7.17,7.17,0,0,0,50,14.51a.5.5,0,0,1,.79.61,8.17,8.17,0,0,1-2.4,2.09A.5.5,0,0,1,48.18,17.28ZM37.27,13.55a.5.5,0,0,1-.46-.31,8.13,8.13,0,0,1-.62-3.12.53.53,0,0,1,.5-.54.47.47,0,0,1,.5.46v.07a7.13,7.13,0,0,0,.54,2.74.5.5,0,0,1-.46.69ZM52,10.64a.48.48,0,0,1-.5-.48v0A7.14,7.14,0,0,0,51,7.41.5.5,0,1,1,51.93,7a8.13,8.13,0,0,1,.6,3.09A.52.52,0,0,1,52,10.64ZM38.32,5.9a.5.5,0,0,1-.39-.81A8.15,8.15,0,0,1,40.33,3a.5.5,0,1,1,.49.87,7.16,7.16,0,0,0-2.12,1.83A.5.5,0,0,1,38.32,5.9ZM48.24,4A.5.5,0,0,1,48,3.93,7.09,7.09,0,0,0,45.35,3a.5.5,0,1,1,.14-1,8.09,8.09,0,0,1,3,1,.5.5,0,0,1-.25.93Z'/><path d='M44.37,20.24H10.12A10.12,10.12,0,1,1,10.12,0H44.37a10.12,10.12,0,1,1,0,20.24ZM10.12,1a9.12,9.12,0,1,0,0,18.24H44.37A9.12,9.12,0,1,0,44.37,1Z'/><path d='M31.2,9.73,28.46,7.53a.5.5,0,0,0-.63.78l1.64,1.32H23.61a.5.5,0,1,0,0,1h5.86l-1.64,1.32a.5.5,0,0,0,.63.78l2.74-2.21a.5.5,0,0,0,0-.78Z'/><path d='M10.37,2.62a7.5,7.5,0,1,0,7.5,7.5A7.5,7.5,0,0,0,10.37,2.62Zm-1,10.75a.48.48,0,0,1-1,0v-.66L6.69,14.44A.48.48,0,1,1,6,13.76L7.74,12H7.08a.48.48,0,1,1,0-1H8.91a.48.48,0,0,1,.48.48Zm0-4.75a.48.48,0,0,1-.48.48H7.08a.48.48,0,0,1,0-1h.66L6,6.4a.48.48,0,0,1,.68-.68L8.42,7.46V6.79a.48.48,0,0,1,1,0Zm.94,2.12a.66.66,0,1,1,.66-.66A.65.65,0,0,1,10.33,10.74Zm4.4,3.7a.48.48,0,0,1-.68,0l-1.73-1.73v.66a.48.48,0,0,1-1,0V11.54a.48.48,0,0,1,.48-.48h1.83a.48.48,0,1,1,0,1H13l1.73,1.73A.48.48,0,0,1,14.73,14.44Zm0-8L13,8.14h.66a.48.48,0,0,1,0,1H11.83a.48.48,0,0,1-.48-.48V6.79a.48.48,0,0,1,1,0v.66L14,5.72a.48.48,0,0,1,.68.68Z'/></svg></div>";
    content += '<p>Stuck here?<br /> Ask for help</p>';
    return content;
  }

  intro() {
    let content = "";
    content += '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 41.5 77.5"><title>obstacle</title><polygon class="cls-1" points="29.5 72.42 5.72 63.35 5.72 4.89 29.5 13.97 29.5 72.42"/><polygon class="cls-1" points="35.88 10.82 12.13 1.67 5.73 4.85 29.48 14 35.88 10.82"/><polygon class="cls-1" points="35.89 10.78 35.89 69.23 29.5 72.42 29.5 13.97 35.89 10.78"/><ellipse class="cls-1" cx="17.91" cy="51.17" rx="3.07" ry="3.4" transform="translate(-11.65 5.72) rotate(-13.75)"/></svg>';
    content += "<p>Unblock obstacles</p>";
    return content;
  }

  show() {
		var _this = this;
		_this.el.style.opacity = 0;
		this.container.appendChild(this.el);

    this.closeButton = document.createElement('div');
    this.closeButton.className = "close";
    this.closeButton.innerHTML = "&times;"

    this.el.appendChild(this.closeButton);
    this.closeButton.addEventListener('click',function() {
        _this.destroy();
    });
		new TweenMax.fromTo(_this.el,0.5,{marginTop:'10px',opacity:0},{marginTop:'0',opacity:1});
	}
}
