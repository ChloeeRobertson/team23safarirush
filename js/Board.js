/*
 * Sets up board and loads level.
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

(function(global) {
    
var
    LENGTH              = 0;  // Length of board in px

var
    tileLength          = 0,  // Length of 1 tile in px
    levelObj            = {}; // Level object for current level (data object)

// ----------------------------------------------------------
//               P U B L I C   F U N C T I O N S
// ----------------------------------------------------------

/**
 * Initializes board.
 */
function initialize() {

    setBoardSize();

    LENGTH = BOARD.width();

    // Make board a square
    BOARD.height(LENGTH);

    // Initialize different functions and features
    initializeResetButton();
    LevelSelector.initialize();
    PieceAssets.initialize();
    Sound.initialize();
    Tracker.initialize();

    // Load data from saved player data or load first level
    if (Tracker.hasPlayerData()) {
        Tracker.loadPlayerData();
    } else {
        loadLevel(1);
    }
}
    
/**
 * Load level configuration onto board.
 *
 * @param levelNum  the level to load
 */
function loadLevel(levelNum) {

    // Re-loads default board configurations for current level
    if (!levelNum) {
        loadLevelFromString();
    }

    // Load new level
    else {

        // Loads level string from backend. Doesn't work locally.
        if (LOAD_LEVEL_FROM_BACKEND) {
            $.ajax({
                url:     AJAX_URL.GET_LEVEL + '?level=' + levelNum,
                success: loadLevelFromString
            });
        }

        // Loads from globals.js LEVEL_STRING
        else {
            loadLevelFromString(LEVEL_STRING[levelNum]);
        }
    }
}

/**
 * Returns the board container.
 */
function getBoard() {
    return BOARD;
}

/**
 * Get length of board in px.
 */
function getLength() {
    return LENGTH;
}

/**
 * Get length of tile in px.
 */
function getTileLength() {
    return tileLength;
}

/**
 * Clear board pieces.
 */
function clearBoard() {
    BOARD.empty();
}

// Make public functions go public
global.Board = {
    initialize:         initialize,
    loadLevel:          loadLevel,
    getBoard:           getBoard,
    getLength:          getLength,
    getTileLength:      getTileLength,
    clearBoard:         clearBoard
};

// ----------------------------------------------------------
//               C O R E   F U N C T I O N S
// ----------------------------------------------------------

/**
 * Sets the board size based on device screen size.
 */
function setBoardSize() {
    var width = global.innerWidth;

    var screenSizes = [

        // iPhone 5 sized screens
        {
            min: 0,
            max: 360,
            borderWidth: 320
        },

        // large phone screens
        {
            min: 361,
            max: 420,
            borderWidth: 360
        },

        // phablets and tablets
        {
            min: 421,
            max: 720,
            borderWidth: 420
        },

        // hd tablets and desktops
        {
            min: 721,
            max: 9999,
            borderWidth: 500
        }
    ];

    for (var i in screenSizes) {
        var min = screenSizes[i].min;
        var max = screenSizes[i].max;
        var borderWidth = screenSizes[i].borderWidth;

        if (min <= width && width <= max) {
            BORDER.width(borderWidth);
            break;
        }
    }
}

/**
 * Load level pieces onto the board and invoke
 * sr.loadMechanics() after pieces finish loading.
 *
 *@params levelString  string that represents the board config for the level 
 */
function loadLevelFromString(levelString) {
    var resetCounters;

    // Loads a new level
    if (levelString) {
        resetCounters = true;

        levelObj = createLevel(levelString.trim());
        tileLength = LENGTH / levelObj.boardSize;

        LevelSelector.setLevel(levelObj.level);
        LevelSelector.unlock();
    }

    clearBoard();

    for (var i = 0; i < levelObj.pieces.length; i++) {
        loadPiece(levelObj.pieces[i]);
    }

    Mechanics.initialize(levelObj, resetCounters);
}

/**
 * Loads a piece into the HTML DOM.
 *
 * @params piece    takes the piece to load 
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
            width:  piece.w * tileLength,
            height: piece.h * tileLength,
            left:   piece.x * tileLength,
            top:    piece.y * tileLength
        });

    PieceAssets.load(piece, pieceElement);

    pieceElement.appendTo(BOARD);
}

// ----------------------------------------------------------
//            H E L P E R   F U N C T I O N S
// ----------------------------------------------------------

/**
 * Create and returns a level (data object).
 *
 * @params levelString  string that represents the board config for the level 
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
        boardSize:    parts[1],
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
 * Initialize reset button.
 */
function initializeResetButton() {
    RESET_BUTTON.on('click', function() {
        loadLevel();
    });
}

})(window);
