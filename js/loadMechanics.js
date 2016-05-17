/*
 * Adds game mechanics to all pieces with the assistance of
 * jQuery.pep library.
 *
 * Must be loaded after loadLevel.js
 *
 * Requires:
 *     - jQuery         [http://jquery.com/]
 *     - jQuery.pep     [http://pep.briangonzalez.org/]
 *
 * Notes:
 *     - All x,y coordinates are relative to the BOARD
 *          i.e. (0,0) = top left corner of the BOARD
 */

(function() {

/**
 * Create accesspoints outside of loadMechanics.js
 */
function setGlobals() {
    window.sr.loadMechanics = loadMechanics;
}

// ----------------------------------------------------------
//                     V A R I A B L E S
// ----------------------------------------------------------

var
    BOARD,           // Board element
    BOARD_LENGTH_PX, // Board length in px
    TILE_LENGTH_PX,  // Tile length in px
    PIECES,          // Board pieces (jQuery.pep objects)
    PIECE_CLASSES    = window.sr.PIECE_CLASSES,
    JEEP_ID          = window.sr.JEEP_ID;

var
    activePiecePosition; // Stores active piece's original position

var
    NUM_MOVES_DIV,   // DIV container holding # of moves
    NUM_MOVES_DIV_ID = 'numMoves',
    numMoves         = 0;

var
    // User wins when Jeep gets to these x, y coordinates
    goalX,
    goalY;

// Timer variables
var
    minuteTimer = 0,
    secondTimer = 0,
    tenthsTimer = 0,
    TIMER_DIV,
    TIMER_DIV_ID = 'timerDisplay';


// ----------------------------------------------------------
//               C O R E   F U N C T I O N S
// ----------------------------------------------------------

/**
 * Timer function
 */
function timer(){

    tenthsTimer++;
    if (tenthsTimer == 10) {
        secondTimer++;
        tenthsTimer = 0;
    }
    if (secondTimer == 60) {
        secondTimer = 0;
        minuteTimer++;
    }
    updateTimer(tenthsTimer, secondTimer, minuteTimer);
    setTimeout(function(){timer()}, 100);

}
    
/**
 * Add game mechanics to all pieces inside the board.
 */
function loadMechanics(levelGoalX, levelGoalY, resetMoveCounter) {


    // Pep objects does not auto-reset when loading new level,
    // so we manually reset it.
    $.pep.peps = [];

    $('.' + PIECE_CLASSES.HORIZONTAL).pep({
        axis:               'x',
        shouldEase:         false,
        useCSSTranslation:  false,
        initiate: handleMovementInitiate,
        // start: handleMovementStart,
        // drag: handleMovementDrag,
        stop: handleMovementStop
    });

    $('.' + PIECE_CLASSES.VERTICAL).pep({
        axis:               'y',
        shouldEase:         false,
        useCSSTranslation:  false,
        initiate: handleMovementInitiate,
        // start: handleMovementStart,
        // drag: handleMovementDrag,
        stop: handleMovementStop
    });

    initializeVariables(levelGoalX, levelGoalY);
    setMovementConstraints();

    //TEST
    timer();

    if (resetMoveCounter) {
        updateNumMoves(0);
    }
}

/**
 * Invoked when first touch/click is triggered on pieceObj. (touchstart/mousedown)
 */
function handleMovementInitiate(event, pieceObj) {
    setActivePiecePosition(pieceObj);
}

/**
 * Invoked when dragging stops on pieceObj. (touchend/mouseup)
 */
function handleMovementStop(event, pieceObj) {
    snapToGrid(pieceObj);

    if (hasMoved(pieceObj)) {
        setMovementConstraints(pieceObj);
        updateNumMoves();
        checkWin(pieceObj);
    }
}

/**
 * Snap piece onto grid.
 */
function snapToGrid(pieceObj) {
    if (movesHorizontally(pieceObj)) {
        var currentX = pieceObj.el.offsetLeft;
        var newX     = Math.round(currentX / TILE_LENGTH_PX) * TILE_LENGTH_PX;

        pieceObj.el.style.left = newX + 'px';
    } else {
        var currentY = pieceObj.el.offsetTop;
        var newY     = Math.round(currentY / TILE_LENGTH_PX) * TILE_LENGTH_PX;

        pieceObj.el.style.top = newY + 'px';
    }
}

/**
 * Sets constraint for every other piece except the piece in parameter.
 */
function setMovementConstraints(pieceObj) {
    for (var i in PIECES) {
        if (PIECES[i] != pieceObj) {
            setMovementConstraintFor(PIECES[i]);
        }
    }
}

/**
 * Checks if user has won the game.
 */
function checkWin(pieceObj) {
    if (pieceObj.el.id == JEEP_ID && occupying(goalX, goalY, pieceObj)) {
        alert('You win!');
    }
}

// ----------------------------------------------------------
//            H E L P E R   F U N C T I O N S
// ----------------------------------------------------------

/**
 * Initialize variables.
 */
function initializeVariables(levelGoalX, levelGoalY) {
    PIECES          = $.pep.peps;
    BOARD           = PIECES[0].el.offsetParent;
    BOARD_LENGTH_PX = BOARD.offsetWidth;
    TILE_LENGTH_PX  = Math.min(PIECES[0].el.offsetWidth, PIECES[0].el.offsetHeight);

    NUM_MOVES_DIV   = $('#' + NUM_MOVES_DIV_ID);
    TIMER_DIV       = $('#' + TIMER_DIV_ID);

    // Goal x,y tile midpoints
    goalX = levelGoalX * TILE_LENGTH_PX + (TILE_LENGTH_PX / 2);
    goalY = levelGoalY * TILE_LENGTH_PX + (TILE_LENGTH_PX / 2);
}

/**
 * Updates number of moves taken.
 */
function updateNumMoves(newNumMoves) {
    numMoves = (Number.isInteger(newNumMoves)) ? newNumMoves : ++numMoves;
    NUM_MOVES_DIV.text(numMoves);
}

/**
 * Function to update the timer display
 * @param tenthsTimer   tenths of seconds
 * @param secondTimer   seconds display value
 * @param minuteTimer   minutes display value
 */
function updateTimer (tenthsTimer, secondTimer, minuteTimer) {
    if (secondTimer < 10 && minuteTimer < 10) {
        TIMER_DIV.text("0" + minuteTimer + ":0" + secondTimer + ":" + tenthsTimer);
    } else if (secondTimer < 10 && minuteTimer >= 10) {
        TIMER_DIV.text(minuteTimer + ":0" + secondTimer + ":" + tenthsTimer);
    } else if (secondTimer >= 10 && minuteTimer < 10) {
        TIMER_DIV.text("0" + minuteTimer + ":" + secondTimer + ":" + tenthsTimer);
    } else {
        TIMER_DIV.text(minuteTimer + ":" + secondTimer + ":" + tenthsTimer);
    }
}

/**
 * Sets the current active piece's original position.
 */
function setActivePiecePosition(pieceObj) {
    activePiecePosition = {
        left:   pieceObj.el.offsetLeft,
        top:    pieceObj.el.offsetTop
    };
}

/**
 * Sets piece movement constraints.
 */
function setMovementConstraintFor(pieceObj) {
    var top     = 0;
    var right   = BOARD_LENGTH_PX;
    var bottom  = BOARD_LENGTH_PX;
    var left    = 0;
    var range;

    if (movesHorizontally(pieceObj)) {
        range   = getMovableRangeX(pieceObj);
        left    = range.min;
        right   = range.max;
    } else {
        range   = getMovableRangeY(pieceObj);
        top     = range.min;
        bottom  = range.max;
    }

    pieceObj.options.constrainTo = [top, right, bottom, left];
}

/**
 * Determines whether a piece has moved or not.
 */
function hasMoved(pieceObj) {
    var xDifference = Math.abs(activePiecePosition.left - pieceObj.el.offsetLeft);
    var yDifference = Math.abs(activePiecePosition.top - pieceObj.el.offsetTop);

    return xDifference > (TILE_LENGTH_PX / 2) ||
           yDifference > (TILE_LENGTH_PX / 2);
}

/**
 * Get mid-point coordinates for the piece's first tile.
 * Each piece may occupy 2 or 3 tiles depending on its size.
 */
function getCoordinates(pieceObj) {
    return {
        x: pieceObj.el.offsetLeft + (TILE_LENGTH_PX / 2),
        y: pieceObj.el.offsetTop + (TILE_LENGTH_PX / 2)
    };
}

/**
 * Calculates valid min-x and max-x coordinates for a horizontally moving piece.
 */
function getMovableRangeX(pieceObj) {
    var coord = getCoordinates(pieceObj);
    var minX  = coord.x;
    var maxX  = coord.x;

    while (inBounds(minX, coord.y) && canOccupy(minX, coord.y, pieceObj)) {
        minX -= TILE_LENGTH_PX;
    }

    while (inBounds(maxX, coord.y) && canOccupy(maxX, coord.y, pieceObj)) {
        maxX += TILE_LENGTH_PX;
    }

    return {
        min: minX + (TILE_LENGTH_PX / 2),
        max: maxX - (TILE_LENGTH_PX / 2) - pieceObj.el.offsetWidth
    };
}

/**
 * Calculates valid min-y and max-y coordinates for a vertically moving piece.
 */
function getMovableRangeY(pieceObj) {
    var coord = getCoordinates(pieceObj);
    var minY = coord.y;
    var maxY = coord.y;

    while (inBounds(coord.x, minY) && canOccupy(coord.x, minY, pieceObj)) {
        minY -= TILE_LENGTH_PX;
    }

    while (inBounds(coord.x, maxY) && canOccupy(coord.x, maxY, pieceObj)) {
        maxY += TILE_LENGTH_PX;
    }

    return {
        min: minY + (TILE_LENGTH_PX / 2),
        max: maxY - (TILE_LENGTH_PX / 2) - pieceObj.el.offsetHeight
    };
}

/**
 * Determines if a piece can occupy a coordinate x, y.
 */
function canOccupy(x, y, pieceObj) {
    for (var i in PIECES) {
        if (pieceObj != PIECES[i] && occupying(x, y, PIECES[i])) {
            return false;
        }
    }
    return true;
}

/**
 * Determines if a piece is occupying a coordinate x, y.
 */
function occupying(x, y, pieceObj) {
    var left    = pieceObj.el.offsetLeft;
    var right   = left + pieceObj.el.offsetWidth;
    var top     = pieceObj.el.offsetTop;
    var bottom  = top + pieceObj.el.offsetHeight;

    return left <= x && x <= right &&
           top  <= y && y <= bottom;
}

/**
 * Determines if a coordinate x, y is within the board.
 */
function inBounds(x, y) {
    return 0 <= x && x <= BOARD_LENGTH_PX &&
           0 <= y && y <= BOARD_LENGTH_PX;
}

/**
 * Determines whether a piece moves horizontally or not.
 */
function movesHorizontally(pieceObj) {
    return pieceObj.el.offsetWidth > pieceObj.el.offsetHeight;
}

// Set global variables
setGlobals();

})();
