( function( _win ) {

/**
 * Default level 1 string. Contains info of all pieces and board size.
 *      - Could use AJAX to retrieve level from MySQL db.
 *
 * 6        Number of tiles - assumed square
 *
 * 5, 2     Goal X & Y Coordinate (Where the Jeep is suppose to go)
 *          [x, y] : [5, 2]
 *
 * 0013     Top left tile of piece [x, y] : [0, 0]
 *  .       Width and height of piece [w, h] : [1, 3]
 *  .
 *  .
 * 1221j    The 'j' stands for Jeep. Every level must have 1 Jeep.
 */
// var lvl1String = '6,5,2,0021,5013,0113,3113,1221j,0412,4421,2531';

/**
 * Makes a level object and returns it.
 *
 * @param levelString   A formatted string containing level info:
 *                      - Board size
 *                      - Goal XY Coordinate (Where the Jeep is suppose to go)
 *                      - Pieces information (Jeep, animal size and position)
 *
 * @returns {{boardW: *, boardH: *, goalX: *, goalY: *, pieces: Array}}
 */
function makeLevelObject( levelString ) {

    // Splits the levelString into an array
    var parts = levelString.split( "," );

    // Create all level pieces
    // Pieces starts at index 3, previous elements store other info
    var pieces = [];
    for ( var i = 3; i < parts.length; i++ ) {
        var id = i - 3;
        pieces.push( makePieceObject( id, parts[i] ) );
    }

    // Create and return a level object
    return {

        // Board size - assumed square board
        boardSize:  parts[0],

        // Level ends when Jeep gets to goal
        goalX:      parts[1],
        goalY:      parts[2],

        // Array of individual piece objects
        pieces:     pieces
    };
}

/**
 * Makes a piece object and returns it.
 *
 * @param pieceString       A formatted string containing piece info:
 *                          - X & Y Position (Column #, Row #)
 *                          - Width & Height (Measured in # of tiles)
 *                          - Jeep or Animal (extra character for Jeep in string)
 *
 * @returns {{x: Number, y: Number, w: Number, h: Number, isJeep: boolean}}
 */
function makePieceObject( id, pieceString ) {

    // Create & return a piece object
    // string[1] is equivalent to string.charAt(1)
    return {
        // id: parseInt( id ),
        x: parseInt( pieceString[0] ),
        y: parseInt( pieceString[1] ),
        w: parseInt( pieceString[2] ),
        h: parseInt( pieceString[3] ),
        isJeep: pieceString[4] ? true : false
    };
}

/**
 * Makes a DOM object for one piece and returns it.
 *
 * @param id            Piece ID.
 * @param piece         Piece object.
 * @param tileSize      Tile size - assumed square.
 * @returns {*|jQuery}
 */
function makePieceDom( id, piece, tileSize ) {

    if ( piece.isJeep ) {
        var bgColor = 'black';
        var idAttr = 'jeep';
    } else {
        var bgColor = randomColor();
        var idAttr = 'piece' + id;
    }

    // Differentiate between the Jeep and animals
    var bgColor = piece.isJeep ? 'black' : randomColor();

    // Moves horizontally or vertically?
    var orientation = piece.w == 1 ? 'dragY' : 'dragX';

    // Create and return a DOM element
    var domPiece = $( '<div></div>' )
        .addClass( 'tile ' + orientation )
        .attr( 'id', 'piece' + id )
        .css( {
            width:  piece.w * tileSize,
            height: piece.h * tileSize,
            left:   piece.x * tileSize,
            top:    piece.y * tileSize,
            'background-color': bgColor
        } );

    // Easter Egg: Double click Jeep
    if ( piece.isJeep ) {
        domPiece.on('dblclick', easterEgg);
    }

    return domPiece;
}

/**
 * Loads the level onto the browser.
 *
 * @param levelString   Level object.
 * @param boardId       ID of board element in DOM.
 * @param callback      Callback function invoked when level loaded.
 */
function loadLevel( levelString, boardId, callback ) {

    // jQuery wrapped board - assumed valid boardId
    var board = $( '#' + boardId );

    // Level object
    var level = makeLevelObject( levelString );

    // Tile size in pixels - assumed square board
    var tileSize = board.width() / level.boardSize;

    // Empty all board children
    board.empty();

    // Make DOM objects for all pieces and append to the board
    for ( var i = 0; i < level.pieces.length; i++ ) {

        // Add new DOM object piece to board
        board.append( makePieceDom( i, level.pieces[i], tileSize ) );
    }

    // Callback function after level loads
    // Need to redo if loading images and animations
    if ( typeof callback === 'function' ) {
        callback();
    }
}

// Easter Egg
function easterEgg() {
    var audio = new Audio();
    audio.src = '../audio/CrocHunterCrikey3.wav';
    audio.play();
}

// TEMPOARY !!!
// Generates a random color with hash-tag (#) in front
function randomColor() {
    var colors = [
        'cc0099',
        '0066ff',
        '009933',
        'ff6600'
    ];

    var randomIndex = Math.floor( Math.random() * colors.length );

    return '#' + colors[randomIndex];
}

// Register global variable
_win.loadLevel = loadLevel;

} )( window );