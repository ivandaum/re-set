function rand(min,max) {
  return Math.floor(Math.random()*(max-min+1)+min);
}

function randFloat(min,max) {
  return (Math.random() * (max - min) + min)
}

function render() {

  // Little hack
  // Push your method in RENDER_LIST to execute them
  for (var i = 0; i < RENDER_LIST.length; i++) {
    if(typeof RENDER_LIST[i] == "function") {
      RENDER_LIST[i]()
    }
  }

  requestAnimationFrame(render)
}
