(function(_window) {

// Shared across all js files
var sr = {

	// Integer representation of yes, positive, true, etc..
	YAY: 1,

	// Integer representation of no, negative, false, etc...
	NAY: -1,

	// Translate x & y cell # into coordinates in px
    xyToCoord: function(x, y, cellW, cellH) {
        x *= cellW;
        y *= cellH;
        return [x, y];
    },

    // Translate x & y coord px into cell #s
    coordToXy: function(x, y, cellW, cellH) {
        x = roundDown(x / cellW);
        y = roundDown(y / cellH);
        return [x, y];
    },

	// Log error message to console and return false
	error: function(msg) {
		console.log('[ERROR] ' + msg);
		return false;
	}
};

var
	// Reference to useful functions
    roundDown = Math.floor;

// Register global variable
_window.sr = sr;

})(window);