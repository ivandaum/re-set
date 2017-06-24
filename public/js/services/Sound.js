class Sound {
  constructor() {
    this.sounds = {
      room: {
        white:null,
        grey:null,
        black:null
      },
      event: {
        zoom:null,
        new_user:null,
        light:null,
        interaction:null,
        help_button:null,
        drop_obstacle:null
      }
    };

    this.percentLigth = 0;
    this.ambianceSoundStarted = [];
    this.src = "/public/sound/";
    this.currentAmbianceSounds = null;
    this.mute = false;
    this.ambianceSound = {
      current:{
        obj:null,
        playing:null
      },
      next: {
        obj:null,
        playing:null
      }
    }
    this.preload();
  }

  preload(callback,callbackOnEach) {
    var _this = this;
    for (let dir in this.sounds) {
        for (let sound in this.sounds[dir]) {

          let loop = false;
          if(dir == 'room') {
            loop = true;
          }
          this.sounds[dir][sound] = new Howl({
            src:this.src + dir + '/' + sound + '.mp3',
            preload: true,
            loop:loop,
            onend:function() {
              if(isFunction(callbackOnEach)) {
                callbackOnEach();
              }
            },
            onfade: function() {

              if(this._volume == 0) {
                  this.stop();
              } else {
                _this.ambianceSound.current = {
                  obj: _this.ambianceSound.next.obj,
                  playing: _this.ambianceSound.next.playing
                }
                _this.ambianceSound.next = {
                  obj:null,
                  playing:null
                }
              }
            }
          })
        }
    }
  }

  changeAmbiance (current) {

    if(notNull(this.ambianceSound.current.obj)) {
        this.ambianceSound.current.obj.fade(0.5,0,1000,this.ambianceSound.current.playing);
    }

    this.ambianceSound.next.obj = current;
    this.ambianceSound.next.playing = current.play();
    this.ambianceSound.next.obj.fade(0,0.5,1000,this.ambianceSound.next.playing);

  }

  testAmbiance(percentLigth) {
    if(this.percentLigth == percentLigth && this.percentLigth != 0) return false;

    if(percentLigth<33) {
      if(this.ambianceSoundStarted.indexOf('black') != -1) return;
      SOUND.play({room:'black'});
      this.ambianceSoundStarted.push('black');
    } else if (percentLigth >= 33 && percentLigth < 66) {
      if(this.ambianceSoundStarted.indexOf('grey') != -1) return;
      SOUND.play({room:'grey'})
      this.ambianceSoundStarted.push('grey');
    } else {
      if(this.ambianceSoundStarted.indexOf('white') != -1) return;
      SOUND.play({room:'white'});
      this.ambianceSoundStarted.push('white');
    }

    this.percentLigth = percentLigth;
  }

  play(array) {
      if(this.mute) return false;

      var _this = this,
          current = null;

      for(let name in array) {

        if(isNull(this.sounds[name])) continue;

        if(isNull(this.sounds[name][array[name]])) continue;

        current = this.sounds[name][array[name]];

        if(name == 'room') {
            this.changeAmbiance(current);
        } else {
          this.sounds[name][array[name]].play();
        }
      }

      if(notNull(current)) {
        return current;
      } else {
        return false;
      }
  }

  mute(bool) {
    var _this = this;
    this.mute = bool;

    if(bool) {
      _this.currentAmbianceSounds.mute(true);
    } else {
      this.currentAmbianceSounds.mute(false);
    }
  }
}
