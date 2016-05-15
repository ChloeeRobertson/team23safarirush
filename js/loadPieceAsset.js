/*
 * Loads Jeep and animal images and sounds.
 *
 * Requires:
 *     - jQuery         [http://jquery.com/]
 */

(function() {

/**
 * Create accesspoints outside of loadPieceAsset.js
 */
function setGlobals() {
    window.sr.loadPieceAsset = loadPieceAsset;
}

// ----------------------------------------------------------
//                     V A R I A B L E S
// ----------------------------------------------------------

var
    JEEP_ID         = sr.JEEP_ID,
    PIECE_CLASSES   = sr.PIECE_CLASSES,
    ANIMAL_IMG_DIR  = '../images/animals/',
    ANIMAL_IMG_EXT  = '.jpg',
    ANIMALS = [
        [], [], // Index(size) 0,1 empty. No animals of that size.
        ['zebra', 'lion'],
        ['elephant', 'giraffe']
    ];

var
    EASTER_EGG = {
        CLICKS_NEEDED:  10,    // # of clicks to activate Easter Egg
        CLICK_SPEED:    400,   // Click succession speed in ms
        AUDIO_SRC:      '../audio/CrocHunterCrikey3.wav'
    },

    // Used for Desktop clicks only
    easterEggCounter    = 0,    // Counts # of clicks in succession
    easterEggLastClick  = 0;    // Last click timestamp

// ----------------------------------------------------------
//               C O R E   F U N C T I O N S
// ----------------------------------------------------------

/**
 * Loads piece assets.
 */
function loadPieceAsset(piece, pieceElement, board) {
    if (piece.isJeep) {
        pieceElement
            .attr('id', JEEP_ID) // Used for checkWin() in loadMechanics.js
            .on('click touchstart', easterEgg);
    } else {
        var animalImgUrl = getAnimalImgUrl(piece.w, piece.h);
        pieceElement.append('<img src="' + animalImgUrl + '">');
    }
};

// ----------------------------------------------------------
//            H E L P E R   F U N C T I O N S
// ----------------------------------------------------------

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
        clicksReached = (++easterEggCounter >= EASTER_EGG.CLICKS_NEEDED - 1);
    }

    if (clicksReached) {
        easterEggCounter = 0;

        audio = new Audio();
        audio.src = EASTER_EGG.AUDIO_SRC;
        audio.play();
    }

    easterEggLastClick = event.timeStamp;
}

/**
 * Get a random animal image given a size.
 */
function getAnimalImgUrl(pieceW, pieceH) {
    var size         = Math.max(pieceW, pieceH);
    var randomIndex  = Math.floor(Math.random() * ANIMALS[size].length);
    var randomAnimal = ANIMALS[size][randomIndex];

    return ANIMAL_IMG_DIR + randomAnimal + ANIMAL_IMG_EXT;
}

// Set global variables
setGlobals();

})();
