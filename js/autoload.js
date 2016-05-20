/*
 * Automatically set-up board and load level 1 on document ready
 *
 * Must be the last script to load on the webpage.
 *
 * Requires:
 *     - jQuery         [http://jquery.com/]
 */

$(document).ready(function() {

// Set-up board and load first level
if (AUTO_LOAD_LEVEL_ON_DOCUMENT_READY) {
    setTimeout(function() {
    	sr.setupBoard();
    	sr.loadLevel(1);
    }, 1000);
}

MUTE_BUTTON.on('click', sr.muteToggle);

});
