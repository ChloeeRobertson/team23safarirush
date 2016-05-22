/*
 * Sets up board and loads level.
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
 * Setsup board and related features.
 */
function setupBoard() {

    // Make board a square
    BOARD.height(BOARD.width());

    sr.loadLevelSelector();
    sr.initializeMuteFunction();
    initializeLevelCompleteModal();
}

/**
 * Load level configuration onto board.
 */
function loadLevel(levelNum) {

    // Re-loads default board configurations for current level
    if (!levelNum) {
        loadLevelFromString();
    }

    // Load new level
    else {

        // Loads from backend. Don't work locally.
        if (LOAD_LEVEL_FROM_BACKEND) {
            var getLevelStringURL = AJAX_URL.GET_LEVEL + '?level=' + levelNum;
            sr.ajaxGet(getLevelStringURL, loadLevelFromString);
        }

        // Loads from globals.js LEVEL_STRING
        else {
            loadLevelFromString(LEVELS_STRING[levelNum]);
        }
    }
}

/**
 * Show level complete modal.
 */
function showLevelCompleteModal() {
    if (!sr.hasNextUnplayedLevel()) {
        NEXT_LEVEL_BUTTON.hide();
        RANDOM_LEVEL_BUTTON.hide();
    }

    LEVEL_COMPLETE_MODAL.modal('show');
}

// Attach public functions to global sr object
window.sr.setupBoard             = setupBoard;
window.sr.loadLevel              = loadLevel;
window.sr.showLevelCompleteModal = showLevelCompleteModal;

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
        resetCounters = true;

        levelObj = createLevel(levelString.trim());
        tileLengthPx = BOARD.width() / levelObj.boardLength;

        // Updates the level selector
        sr.updateLevelSelector(levelObj.level);
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
            top:    piece.y * tileLengthPx
        });

    sr.loadPieceAssets(piece, pieceElement);

    pieceElement.appendTo(BOARD);
}

// ----------------------------------------------------------
//            H E L P E R   F U N C T I O N S
// ----------------------------------------------------------

/**
 * Link level complete modal buttons to actual functions.
 */
function initializeLevelCompleteModal() {
    NEXT_LEVEL_BUTTON.on('click touchend', function() {
        var level = sr.getNextUnplayedLevel();
        loadLevel(level);
        hideLevelCompleteModal();
    });

    RANDOM_LEVEL_BUTTON.on('click touchend', function() {
        var level = sr.getRandomUnplayedLevel();
        loadLevel(level);
        hideLevelCompleteModal();
    });

    SUBMIT_SCORE_BUTTON.on('click touchend', function() {
        sr.submitScore();
        hideLevelCompleteModal();
    });
}

/**
 * Hide level complete modal.
 */
function hideLevelCompleteModal() {
    LEVEL_COMPLETE_MODAL.modal('hide');
}

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

/**
 * Updates the level selection button and modal to show correct difficulty and level.
 */
function updateLevelSelector() {
    var level      = levelObj.level;
    var difficulty = sr.getLevelDifficulty(levelObj.level);

    sr.setCurrentLevelInSelector(level);

    var diff;
    var lvl;
    var lvlIndex;

    // Evaluate the level number to determine difficuly and level
    // Also updates the difficulty selection in the level selection modal
    if (levelObj.level <= 10) {
        diff = "Easy";
        lvl = levelObj.level;
        lvlIndex = lvl - 1;
        $('#difficulty').prop("selectedIndex", "0");
    } else if (levelObj.level <= 20) {
        diff = "Intermediate";
        lvl = levelObj.level - 10;
        lvlIndex = lvl - 1;
        $('#difficulty').prop("selectedIndex", "1");
    } else if (levelObj.level <= 30) {
        diff = "Advanced";
        lvl = levelObj.level - 20;
        lvlIndex = lvl - 1;
        $('#difficulty').prop("selectedIndex", "2");
    } else {
        diff = "Expert";
        lvl = levelObj.level - 30;
        lvlIndex = lvl - 1;
        $('#difficulty').prop("selectedIndex", "3");
    }

    // Update the level selection in the level selection modal
    $('#level').prop("selectedIndex", lvlIndex);

    // Update the level selection button
    $('#levelSelectionButton').html(
        diff + " - " + lvl
        + " <span class=\"glyphicon glyphicon-triangle-top\"></span>"
    );
}

})();
