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
    if (AUTO_LOAD_BOARD_ON_DOCUMENT_READY) {

        // Delayed due to media queries taking time to load
        setTimeout(function() {
            Board.initialize();
        }, 1500);
    }
});

// Show landscape mode warning modal if orientation changes
window.addEventListener('orientationchange', function() {
    var inPortraitMode = (window.orientation && window.orientation !== 0) ? false : true;
    var message = 'Landscape mode not supported. Flip back to portrait mode.';

    if (inPortraitMode) {
        Tracker.hideMessage();
    } else {
        Tracker.showMessage(message);
    }
});