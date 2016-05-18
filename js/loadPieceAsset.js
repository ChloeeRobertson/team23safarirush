/*
 * Loads Jeep & animal images and sounds.
 * 
 * Must be loaded after global.js and loadLevel.js
 *
 * Requires:
 *     - jQuery         [http://jquery.com/]
 */

(function() {

var
    animal;

var
    // Used for Desktop clicks only
    easterEggClickCounter   = 0,    // Counts # of clicks in succession
    easterEggLastClick      = 0;    // Last click timestamp

// ----------------------------------------------------------
//               P U B L I C   F U N C T I O N S
// ----------------------------------------------------------

/**
 * Loads piece assets.
 */
function loadPieceAsset(piece, pieceElement, board) {
    if (piece.isJeep) {
        loadJeep(pieceElement);
    } else {
        assignRandomAnimal(piece);
        loadAnimal(pieceElement);
    }
};

// Attach public functions to global sr object
window.sr.loadPieceAsset = loadPieceAsset;

// ----------------------------------------------------------
//               C O R E   F U N C T I O N S
// ----------------------------------------------------------

/**
 * Load jeep assets.
 */
function loadJeep(pieceElement) {
    animal = PIECE.JEEP_IMG_NAME;

    pieceElement
        .attr('id', DIV_ID.JEEP) // Used for checkWin() in loadMechanics.js
        .append('<img src="' + getImgUrl() + '">')
        .on('click touchstart', easterEgg);
}

/**
 * Load animal assets.
 */
function loadAnimal(pieceElement) {
    pieceElement.append('<img src="' + getImgUrl() + '">');
}

/**
 * Easter Egg.
 */
function easterEgg(event) {
    var clickSpeed = event.timeStamp - easterEggLastClick;
    var clicksReached;
    var audio;

    // Mobile tap
    if (event.detail) {
        clicksReached = event.detail >= EASTER_EGG.CLICKS_NEEDED;
    }

    // Desktop click
    else if (event.timeStamp && clickSpeed <= EASTER_EGG.CLICK_SPEED) {
        clicksReached = (++easterEggClickCounter >= EASTER_EGG.CLICKS_NEEDED - 1);
    }

    if (clicksReached) {
        easterEggClickCounter = 0;

        audio = new Audio();
        audio.src = EASTER_EGG.AUDIO_SRC;
        audio.play();
    }

    easterEggLastClick = event.timeStamp;
}

// ----------------------------------------------------------
//            H E L P E R   F U N C T I O N S
// ----------------------------------------------------------

/**
 * Assign piece a random animal.
 */
function assignRandomAnimal(piece) {
    var size        = Math.max(piece.w, piece.h);
    var randomIndex = Math.floor(Math.random() * PIECE.LIST[size].length);
    
    animal  = PIECE.LIST[size][randomIndex];
}

/**
 * Get animal's image URL.
 */
function getImgUrl() {
    return PIECE.IMG_DIR + animal + PIECE.IMG_EXT;
}

/**
 * Get animal's audio URL.
 */
function getAudioUrl() {
    return PIECE.AUDIO_DIR + animal + PIECE.AUDIO_EXT;
}

})();
