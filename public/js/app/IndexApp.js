var IndexApp = function() {
	var startTutorial = document.querySelector('.start-tutorial');
	if(startTutorial) {
		startTutorial.addEventListener('click',function() {
		  document.querySelector('.username-form').style.display = 'block';
		  document.querySelector('.start-tutorial').style.display = 'none';
		})
	}

	var input = document.querySelector('.user-new-name');
 	if(input) {
		input.addEventListener('keydown',function(e) {
		  if(e.which != 13) return;

		  var name = document.querySelector('.user-new-name').value;
		  USER.changeName(name);
		})
	}
}

IndexApp.prototype = {
};
