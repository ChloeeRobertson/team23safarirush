/*
 * Loads pieces' (jeep and animal) images and sounds.
 * 
 * Must be loaded after global.js and loadLevel.js
 *
 * Requires:
 *     - jQuery         [http://jquery.com/]
 */

(function(global) {

// Cheap piece animation
var
    shrinkWidthSizePx     = 0,          // Amount of px to shrink image when tapping pieces
    shrinkPositionSizePx  = 0,          // Amount of px to move image when tapping pieces
    shrunkenImage         = null,       // Reference to the current shrunken image
    shrunkenImageMovesHorizontally = false;

// Easter Egg
var
    // Used for Desktop clicks only
    easterEggClickCounter = 0,          // Counts # of clicks in succession
    easterEggLastClick    = 0;          // Last click timestamp

// ----------------------------------------------------------
//               P U B L I C   F U N C T I O N S
// ----------------------------------------------------------

/**
 * Initialize piece assets.
 */
function initialize() {
    var shrinkSizePx     = Math.floor(Board.getLength() * 0.02);
    shrinkWidthSizePx    = shrinkSizePx * 2;
    shrinkPositionSizePx = shrinkSizePx / 2;
}

/**
 * Loads piece assets.
 */
function load(piece, pieceElement) {
    if (piece.isJeep) {
        var animal = JEEP_ID;
        loadJeepAssets(pieceElement);
    } else {
        var animal = getRandomAnimalName(piece);
    }

    var movesHorizontally = piece.w > piece.h;
    loadAssets(pieceElement, animal, movesHorizontally);
}

// Make public functions go public
global.PieceAssets = {
    initialize: initialize,
    load:       load
};

// ----------------------------------------------------------
//               C O R E   F U N C T I O N S
// ----------------------------------------------------------

/**
 * Add Easter egg for Jeep.
 */
function loadJeepAssets(pieceElement) {
    pieceElement
        .on('mousedown touchstart', easterEgg)
        .attr('id', JEEP_ID); // Used for checkWin() in loadMechanics.js
}

/**
 * Load piece image and sounds effects. 
 */
function loadAssets(pieceElement, pieceName, movesHorizontally) {
    pieceElement
        .append('<img src="' + getImgUrl(pieceName) + '">')
        .on('mousedown touchstart', function() {
            autoUnshrinkImage(); // In case previous shrunken image hasn't unshrunk yet
            Sound.play(pieceName);
            shrinkImage(pieceElement.children(), movesHorizontally);
        });
    Board.getBoard().on('mouseup touchend', function() {
            autoUnshrinkImage();
        });
}

/**
 * Easter Egg: click Jeep 10 times to activate.
 */
function easterEgg(event) {
    var stopOtherSounds = true;
    var clickSpeed = event.timeStamp - easterEggLastClick;
    var clicksReached;

    // Desktop click
    if (event.timeStamp && clickSpeed <= EASTER_EGG.CLICK_SPEED) {
        clicksReached = (++easterEggClickCounter >= EASTER_EGG.CLICKS_NEEDED - 1);
    }

    // Mobile tap
    else if (event.detail) {
        clicksReached = event.detail >= EASTER_EGG.CLICKS_NEEDED;
    }

    if (clicksReached) {
        Sound.play('easter', stopOtherSounds);
        easterEggClickCounter = 0;
    }

    easterEggLastClick = event.timeStamp;
}

// ----------------------------------------------------------
//            H E L P E R   F U N C T I O N S
// ----------------------------------------------------------

/**
 * Unshrinks image if there is an active shrunken image.
 *
 * Used to counter mouse exiting browser while dragging leaving a permanently
 * shrunken image behind.
 */
function autoUnshrinkImage() {
    if (shrunkenImage) {
        var leftOperator  = shrunkenImageMovesHorizontally ? '-=' : '+=';
        shrunkenImage.css({
            width: '+=' + shrinkWidthSizePx,
            top:   '-=' + shrinkPositionSizePx,
            left:  leftOperator + shrinkPositionSizePx
        });

        shrunkenImage = null;
    }
}

/**
 * Shrinks image.
 */
function shrinkImage(image, movesHorizontally) {

    // Store references for auto unshrink
    shrunkenImage = image;
    shrunkenImageMovesHorizontally = movesHorizontally;

    var leftOperator  = movesHorizontally ? '+=' : '-=';
    image.css({
        width: '-=' + shrinkWidthSizePx,
        top:   '+=' + shrinkPositionSizePx,
        left:  leftOperator + shrinkPositionSizePx
    });
}

/**
 * Get a random animal name.
 */
function getRandomAnimalName(piece) {
    var size        = Math.max(piece.w, piece.h);
    var randomIndex = Math.floor(Math.random() * PIECE.ANIMALS[size].length);
    
    return PIECE.ANIMALS[size][randomIndex];
}

/**
 * Get a piece's image URL.
 */
function getImgUrl(pieceName) {
    return PIECE.IMG_DIR + pieceName + PIECE.IMG_EXT;
}

})(window);
