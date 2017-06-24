export const Ajax = {
  get: function(url,callback) {
    var result = {};
    var request = new XMLHttpRequest();
    request.open('GET', url + '?nolayout=1', true);
    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        result = request.responseText;
      } else {
        result = request.status;
      }

      if(typeof callback == 'function') {
        callback(result);
      }
    };
    request.onerror = function(error) {
      result = error;
      if(typeof callback == 'function') {
        callback(result);
      }
    };

    request.send();
  }
}
