/*
 * Loads level onto a board.
 *
 * Must be loaded after global.js
 *
 * Requires:
 *     - jQuery         [http://jquery.com/]
 *
 * -------------------------------------------------------------------
 *
 * var levelString = '6,5,2,0021,5013,0113,3113,1221j,0412,4421,2531';
 * var pieceString =        0021;
 *
 * 6        Number of tiles - assumed square
 *
 * 5, 2     Goal X & Y Coordinate (Where the Jeep is suppose to go)
 *          [x, y] : [5, 2]
 *
 * 0013     Top left tile of piece [x, y] : [0, 0]
 *  .       Width and height of piece [w, h] : [1, 3]
 *  .
 * 1221j    The 'j' stands for Jeep. Every level must have 1 Jeep.
 */

(function() {

var
    tileLengthPx,   // Length of 1 tile in px
    levelObj;       // Level object for current level

// ----------------------------------------------------------
//               P U B L I C   F U N C T I O N S
// ----------------------------------------------------------

/**
 * Sets board height to its width (makes it a square).
 */
function setupBoard() {
    BOARD.height(BOARD.width());
}

/**
 * Get levelString from backend and invoke loadLevelFromString() to
 * load level onto board.
 */
function loadLevel(levelNum) {

    // Re-loads default board configurations for current level
    if (!levelNum) {
        loadLevelFromString();
    }

    // Load level from backend
    else if (Number.isInteger(levelNum)) {
        loadLevelFromString(LEVELS_STRING[levelNum]);

        // Loads from backend. Don't work locally.
        // var getLevelStringURL = AJAX_URL.GET_LEVEL + '?level=' + levelNum;
        // sr.ajaxGet(getLevelStringURL, loadLevelFromString);
    }

    // Reset array containing audio tracks
    sr.clearArray();

    // Updates the level selection button to show correct difficulty and level
    var diff;
    var lvl;

    if (levelNum <= 10) {
        diff = "Easy";
        lvl = levelNum;
    } else if (levelNum <= 20) {
        diff = "Intermediate";
        lvl = levelNum - 10;
    } else if (levelNum <= 30) {
        diff = "Advanced";
        lvl = levelNum - 20;
    } else {
        diff = "Expert";
        lvl = levelNum - 30;
    }

    $('#levelSelectionButton').html(
        diff + " - " + lvl
        + " <span class=\"glyphicon glyphicon-triangle-top\"></span>"
    );
}

// Attach public functions to global sr object
window.sr.setupBoard    = setupBoard;
window.sr.loadLevel     = loadLevel;

// ----------------------------------------------------------
//               C O R E   F U N C T I O N S
// ----------------------------------------------------------

/**
 * Load level pieces onto the board and invoke
 * sr.loadMechanics() after pieces finish loading.
 */
function loadLevelFromString(levelString) {

    var resetCounters;

    // Loads a new level
    if (levelString) {
        var resetCounters = true;

        levelObj = createLevel(levelString.trim());
        tileLengthPx = BOARD.width() / levelObj.boardLength;
    }

    // Deletes all pieces from board
    BOARD.empty();

    for (var i = 0; i < levelObj.pieces.length; i++) {
        loadPiece(levelObj.pieces[i]);
    }

    sr.loadMechanics(levelObj, resetCounters);
}

/**
 * Loads a piece into the HTML DOM.
 */
function loadPiece(piece) {

    // Class names applied to piece
    var orientation = (piece.w == 1) ? PIECE_CLASSNAME.VERTICAL : PIECE_CLASSNAME.HORIZONTAL;
    var pieceSize   = PIECE_CLASSNAME.SIZE[Math.max(piece.w, piece.h)];
    var classNames  = PIECE_CLASSNAME.ALL + ' ' + orientation + ' ' + pieceSize;

    // Create new element in HTML DOM
    var pieceElement = $('<div></div>')
        .addClass(classNames)
        .css({
            width:  piece.w * tileLengthPx,
            height: piece.h * tileLengthPx,
            left:   piece.x * tileLengthPx,
            top:    piece.y * tileLengthPx,
        });

    sr.loadPieceAssets(piece, pieceElement, BOARD);

    BOARD.append(pieceElement);
}

// ----------------------------------------------------------
//            H E L P E R   F U N C T I O N S
// ----------------------------------------------------------

/**
 * Create and returns a level (data object).
 */
function createLevel(levelString) {
    var parts = levelString.split(',');
    var pieces = [];

    // Create each piece (data object) and push into pieces[]
    for (var i = 4; i < parts.length; i++) {
        var piece = createPiece(parts[i]);
        pieces.push(piece);
    }

    return {
        level:        parts[0],
        boardLength:  parts[1],
        goalX:        parts[2],
        goalY:        parts[3],
        pieces:       pieces
    };
}

/**
 * Create and returns a piece (data object).
 */
function createPiece(pieceString) {
    return {
        x: parseInt(pieceString[0]),
        y: parseInt(pieceString[1]),
        w: parseInt(pieceString[2]),
        h: parseInt(pieceString[3]),
        isJeep: pieceString[4] ? true : false
    };
}

})();
