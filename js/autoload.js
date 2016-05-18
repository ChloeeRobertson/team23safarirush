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
        sr.setupBoard();

        // LOADS LVL FROM LEVEL STRING
        var lvl1 = '40,6,5,2,1221j';
        sr.loadLevel(lvl1);

        // LOADS LVL FROM DATABASE
        // sr.loadLevel(1);
    });
}
