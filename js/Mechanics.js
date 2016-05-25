/*
 * Adds game mechanics to all pieces with the assistance of
 * jQuery.pep library.
 *
 * Must be loaded after global.js and loadLevel.js
 *
 * Requires:
 *     - jQuery         [http://jquery.com/]
 *     - jQuery.pep     [http://pep.briangonzalez.org/]
 *
 * Notes:
 *     - All x,y coordinates are relative to the BOARD
 *          i.e. (0,0) = top left corner of the BOARD
 */

(function(global) {
    
// Board and Pieces
var
    pieces              = [],   // Stores all board pieces (from jQuery.pep)
    jeepPiece           = null, // Reference to the jeep piece
    activePiece         = null, // Reference to the active piece
    activePiecePosition = {},   // Original position of active piece

    goalCoordinates     = {};   // Game ends when Jeep gets to here

// Number of Moves
var
    numMoves            = 0;    // Number of moves taken in current level

// Timer variables
var
    minuteTimer         = 0,
    secondTimer         = 0,
    tenthsTimer         = 0,
    timerInstance       = 0;

// ----------------------------------------------------------
//               P U B L I C   F U N C T I O N S
// ----------------------------------------------------------

/**
 * Add game mechanics to all pieces inside the board.
 */
function initialize(levelObj, resetCounters) {

    // Pep objects does not auto-reset when loading new level,
    // so we manually reset it.
    $.pep.peps = [];

    initializeDragging();
    initializeVariables(levelObj);
    setMovementConstraints();

    // Resets number of moves and timer only for new levels
    if (resetCounters) {
        resetNumMoves();
        resetTimer();
    }
}

// Make public functions go public
global.Mechanics = {
    initialize: initialize
};

// ----------------------------------------------------------
//               C O R E   F U N C T I O N S
// ----------------------------------------------------------

/**
 * Invoked when first touch/click is triggered on pieceObj. (touchstart/mousedown)
 */
function handleMovementInitiate(event, pieceObj) {
    setActivePiece(pieceObj);
}

/**
 * Invoked when dragging stops on pieceObj. (touchend/mouseup)
 */
function handleMovementStop(event, pieceObj) {
    snapToGrid(pieceObj);

    if (hasMoved(pieceObj)) {
        setMovementConstraints(pieceObj);
        incrementNumMoves();
        checkWin();
    }
}

/**
 * Initiates Timer function
 */
function timer() {
    tenthsTimer++;
    if (tenthsTimer == 10) {
        secondTimer++;
        tenthsTimer = 0;
    }
    if (secondTimer == 60) {
        secondTimer = 0;
        minuteTimer++;
    }
    updateTimerDisplay();
    timerInstance = setTimeout(function(){timer()}, 100);
}

/**
 * Allow dragging of board pieces.
 */
function initializeDragging() {

    // Make horizontal pieces movable
    $('.' + PIECE_CLASSNAME.HORIZONTAL).pep({
        axis:               'x',
        shouldEase:         false,
        useCSSTranslation:  false,
        initiate: handleMovementInitiate,
        stop: handleMovementStop
    });

    // Make vertical pieces movable
    $('.' + PIECE_CLASSNAME.VERTICAL).pep({
        axis:               'y',
        shouldEase:         false,
        useCSSTranslation:  false,
        initiate: handleMovementInitiate,
        stop: handleMovementStop
    });
}

/**
 * Snap piece onto grid.
 */
function snapToGrid(pieceObj) {
    if (movesHorizontally(pieceObj)) {
        var currentX = pieceObj.el.offsetLeft;
        var newX     = Math.round(currentX / Board.getTileLength()) * Board.getTileLength();

        pieceObj.el.style.left = newX + 'px';
    } else {
        var currentY = pieceObj.el.offsetTop;
        var newY     = Math.round(currentY / Board.getTileLength()) * Board.getTileLength();

        pieceObj.el.style.top = newY + 'px';
    }
}

/**
 * Sets constraint for every other piece except the piece in parameter.
 */
function setMovementConstraints(pieceObj) {
    for (var i in pieces) {
        if (pieces[i] != pieceObj) {
            setMovementConstraintFor(pieces[i]);
        }
    }
}

/**
 * Sets piece movement constraints.
 */
function setMovementConstraintFor(pieceObj) {
    var top     = 0;
    var right   = Board.getLength();
    var bottom  = Board.getLength();
    var left    = 0;
    var range;

    if (movesHorizontally(pieceObj)) {
        range   = getMovableRangeX(pieceObj);
        left    = range.min;
        right   = range.max - pieceObj.el.offsetWidth; // Minus width due to jQuery.pep bug
    } else {
        range   = getMovableRangeY(pieceObj);
        top     = range.min;
        bottom  = range.max - pieceObj.el.offsetHeight; // Minus height due to jQuery.pep bug
    }

    pieceObj.options.constrainTo = [top, right, bottom, left];
}

/**
 * Checks if user has won the game.
 */
function checkWin() {
    if (jeepCanExit()) {
        disableMovements();

        var currentLevel = LevelSelector.getCurrentLevel();
        var secondsTaken = secondTimer + (minuteTimer * 60);

        // Add current level score & statistics to database
        // and compare with other players in database
        Tracker.updateCompletedLevel(currentLevel, numMoves, secondsTaken);

        pauseTimer();

        // Invoked after Jeep exit animation completes
        var callback = function() {

            // Load next level, if there is one
            if (Tracker.hasUnplayedLevel()) {
                var nextLevel = Tracker.getNextUnplayedLevel();
                Board.loadLevel(nextLevel);
                LevelSelector.show(currentLevel);
            }

            // All levels beaten, game over
            else {
                GAMEWON.css({'zIndex': 1});
                Board.clear();
                setTimeout(function() {
                    LevelSelector.show();
                }, LEVEL_SELECTOR_DELAY.SHOW_GAME_WON_MESSAGE_FOR);
            }

            resetNumMoves();
            resetTimer();
            enableMovements();
        };

        animateJeepExit(callback);
    }
}

// ----------------------------------------------------------
//            H E L P E R   F U N C T I O N S
// ----------------------------------------------------------

/**
 * Initialize variables.
 */
function initializeVariables(levelObj) {
    pieces        = $.pep.peps;
    jeepPiece     = getJeepPiece();

    goalCoordinates = {
        x: levelObj.goalX * Board.getTileLength() + (Board.getTileLength() / 2),
        y: levelObj.goalY * Board.getTileLength() + (Board.getTileLength() / 2)
    };
}

// ----------------------------------------------------------
//        M O V E S   C O U N T E R   &   T I M E R

/**
 * Increment number of moves by 1 and start timer on first move.
 */
function incrementNumMoves() {
    numMoves++;

    if (numMoves == 1) {
        timer();
        LevelSelector.lock();
    }

    updateNumMovesDisplay();
}

/**
 * Reset number of moves.
 */
function resetNumMoves() {
    numMoves = 0;
    updateNumMovesDisplay();
}

/**
 * Update number of moves display.
 */
function updateNumMovesDisplay() {
    NUM_MOVES.text(numMoves);
}

/**
 * Reset timer.
 */
function resetTimer() {
    pauseTimer();

    tenthsTimer = 0;
    secondTimer = 0;
    minuteTimer = 0;

    updateTimerDisplay();
}

/**
 * Pauses timer.
 */
function pauseTimer() {
    clearTimeout(timerInstance);
}

/**
 * Function to update the timer display
 */
function updateTimerDisplay() {
    if (secondTimer < 10 && minuteTimer < 10) {
        TIMER.text("0" + minuteTimer + ":0" + secondTimer);
    } else if (secondTimer < 10 && minuteTimer >= 10) {
        TIMER.text(minuteTimer + ":0" + secondTimer);
    } else if (secondTimer >= 10 && minuteTimer < 10) {
        TIMER.text("0" + minuteTimer + ":" + secondTimer);
    } else {
        TIMER.text(minuteTimer + ":" + secondTimer);
    }
}

// ----------------------------------------------------------
//                    J E E P   E X I T

/**
 * Returns the jeep piece.
 */
function getJeepPiece() {
    for (var i in pieces) {
        if (pieces[i].el.id == JEEP_ID) {
            return pieces[i];
        }
    }

    return false;
}

/**
 * Determines whether the Jeep can reach the exit goal with no
 * animals blocking its path.
 */
function jeepCanExit() {
    var jeepMovableRangeX = getMovableRangeX(jeepPiece);
    var jeepMovableRangeY = getMovableRangeY(jeepPiece);

    return jeepMovableRangeX.min <= goalCoordinates.x && goalCoordinates.x <= jeepMovableRangeX.max &&
           jeepMovableRangeY.min <= goalCoordinates.y && goalCoordinates.y <= jeepMovableRangeY.max;
}

/**
 * Animates Jeep exit and calls callback function once complete.
 */
function animateJeepExit(callback) {

    // Play level complete audio
    var stopOtherSounds = true;
    Sound.play('win', stopOtherSounds);

    var moveRightPx  = movesHorizontally(jeepPiece) ? Board.getLength() - jeepPiece.el.offsetLeft : 0;
    var moveBottomPx = movesHorizontally(jeepPiece) ? 0 : Board.getLength() - jeepPiece.el.offsetTop;

    $(jeepPiece.el).animate({
        opacity: 0,
        left: "+=" + moveRightPx,
        top:  "+=" + moveBottomPx
    }, JEEP_EXIT_ANIMATION_DURATION, callback);
}

// ----------------------------------------------------------
//          M O V E M E N T   &   D E T E C T I O N

/**
 * Disables all movements.
 */
function disableMovements() {
    BLACKOUT.css({'zIndex': 9999});
}

/**
 * Enable all movements.
 */
function enableMovements() {
    BLACKOUT.css({'zIndex': -1});
}

/**
 * Sets the current active piece's reference & original position.
 */
function setActivePiece(pieceObj) {
    activePiece = pieceObj;
    activePiecePosition = {
        left:   pieceObj.el.offsetLeft,
        top:    pieceObj.el.offsetTop
    };
}

/**
 * Determines whether active piece has moved or not.
 */
function hasMoved(pieceObj) {

    // Can't track non-active piece
    if (activePiece !== pieceObj) {
        return false;
    }

    var xDifference = Math.abs(activePiecePosition.left - pieceObj.el.offsetLeft);
    var yDifference = Math.abs(activePiecePosition.top - pieceObj.el.offsetTop);

    return xDifference > (Board.getTileLength() / 2) ||
           yDifference > (Board.getTileLength() / 2);
}

/**
 * Get mid-point coordinates for the piece's first tile.
 * Each piece may occupy 2 or 3 tiles depending on its size.
 */
function getCoordinates(pieceObj) {
    return {
        x: pieceObj.el.offsetLeft + (Board.getTileLength() / 2),
        y: pieceObj.el.offsetTop + (Board.getTileLength() / 2)
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
        minX -= Board.getTileLength();
    }

    while (inBounds(maxX, coord.y) && canOccupy(maxX, coord.y, pieceObj)) {
        maxX += Board.getTileLength();
    }

    return {
        min: minX + (Board.getTileLength() / 2),
        max: maxX - (Board.getTileLength() / 2)
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
        minY -= Board.getTileLength();
    }

    while (inBounds(coord.x, maxY) && canOccupy(coord.x, maxY, pieceObj)) {
        maxY += Board.getTileLength();
    }

    return {
        min: minY + (Board.getTileLength() / 2),
        max: maxY - (Board.getTileLength() / 2)
    };
}

/**
 * Determines if a piece can occupy a coordinate x, y.
 */
function canOccupy(x, y, pieceObj) {
    for (var i in pieces) {
        if (pieceObj != pieces[i] && occupying(x, y, pieces[i])) {
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
    return 0 <= x && x <= Board.getLength() &&
           0 <= y && y <= Board.getLength();
}

/**
 * Determines whether a piece moves horizontally or not.
 */
function movesHorizontally(pieceObj) {
    return pieceObj.el.offsetWidth > pieceObj.el.offsetHeight;
}

})(window);
