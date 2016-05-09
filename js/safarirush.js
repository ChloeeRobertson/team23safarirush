(function(_window) {

var sharedFn = {

	// Log error message to console and return false
	error: function(msg) {
		console.log('[ERROR] ' + msg);
		return false;
	}
};

// Register global variable
_window.sr = sharedFn;

})(window);