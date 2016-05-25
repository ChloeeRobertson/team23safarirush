/*
 * Automatically set-up board and load level 1 on document ready
 *
 * Must be the last script to load on the webpage.
 *
 * Requires:
 *     - jQuery         [http://jquery.com/]
 */


// Set-up board and load first level
if (AUTO_LOAD_LEVEL_ON_DOCUMENT_READY) {
    $(document).ready(function() {

        // Set delay due to media queries takes time to load
        setTimeout(function() {
            Board.initialize();
            Board.loadLevel(1);
        }, 1000);
    });
}
