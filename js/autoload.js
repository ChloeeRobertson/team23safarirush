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

        // Delayed due to media queries taking time to load
        setTimeout(function() {
            Board.initialize();
            Board.loadLevel(1);
        }, 1000);
    }

    // Disable exiting warning modal
    LANDSCAPE_WARNING_MODAL.modal({
        backdrop: 'static',
        keyboard: false,
        show:     false
    });

});






window.addEventListener('orientationchange', function() {
    var inPortraitMode = (window.orientation && window.orientation !== 0) ? false : true;

    if (inPortraitMode) {
        LANDSCAPE_WARNING_MODAL.modal('hide');
    } else {
        LANDSCAPE_WARNING_MODAL.modal('show');
    }
});