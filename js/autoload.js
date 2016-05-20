/*
 * Automatically set-up board and load level 1 on document ready
 *
 * Must be loaded after global.js and loadLevel.js
 *
 * Requires:
 *     - jQuery         [http://jquery.com/]
 */

if (AUTO_LOAD_LEVEL_ON_DOCUMENT_READY) {
    $(document).ready(function() {
    	// Set timeout for media query to complete
        setTimeout(function() {
        	sr.setupBoard();
        	sr.loadLevel(1);
        }, 500);
    });
}
