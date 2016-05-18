/*
 * Loads pieces' (jeep and animal) images and sounds.
 * 
 * Must be loaded after global.js and loadLevel.js
 *
 * Requires:
 *     - jQuery         [http://jquery.com/]
 */

(function() {

var
    audio = new Audio();

var
    // Used for Desktop clicks only
    easterEggClickCounter = 0,    // Counts # of clicks in succession
    easterEggLastClick    = 0;    // Last click timestamp

// ----------------------------------------------------------
//               P U B L I C   F U N C T I O N S
// ----------------------------------------------------------

/**
 * Loads piece assets.
 */
function loadPieceAssets(piece, pieceElement, board) {
    if (piece.isJeep) {
        loadJeepAssets(pieceElement);
    } else {
        var animal = getRandomAnimalName(piece);
        loadAnimalAssets(pieceElement, animal);
    }
};

// Attach public functions to global sr object
window.sr.loadPieceAssets = loadPieceAssets;

// ----------------------------------------------------------
//               C O R E   F U N C T I O N S
// ----------------------------------------------------------

/**
 * Load jeep assets.
 */
function loadJeepAssets(pieceElement) {
    pieceElement
        .attr('id', DIV_ID.JEEP) // Used for checkWin() in loadMechanics.js
        .append('<img src="' + getImgUrl(PIECE.JEEP_IMG_NAME) + '">')
        .on('click touchstart', easterEgg);
}

/**
 * Load animal assets.
 */
function loadAnimalAssets(pieceElement, animalName) {
    pieceElement
        .append('<img src="' + getImgUrl(animalName) + '">')
        .on('click touchstart', function() {
            var audioSource = getAudioUrl(animalName);
            playAudio(audioSource);
        });
}

/**
 * Easter Egg.
 */
function easterEgg(event) {
    var clickSpeed = event.timeStamp - easterEggLastClick;
    var clicksReached;

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
        playAudio(EASTER_EGG.AUDIO_SRC);
    }

    easterEggLastClick = event.timeStamp;
}

// ----------------------------------------------------------
//            H E L P E R   F U N C T I O N S
// ----------------------------------------------------------

/**
 * Stops currently playing audio and plays another file.
 */
function playAudio(source) {
    audio.src = source;
    audio.play();
}

/**
 * Get a random animal name.
 */
function getRandomAnimalName(piece) {
    var size        = Math.max(piece.w, piece.h);
    var randomIndex = Math.floor(Math.random() * PIECE.LIST[size].length);
    
    return PIECE.LIST[size][randomIndex];
}

/**
 * Get a piece's image URL.
 */
function getImgUrl(pieceName) {
    return PIECE.IMG_DIR + pieceName + PIECE.IMG_EXT;
}

/**
 * Get a piece's audio URL.
 */
function getAudioUrl(pieceName) {
    return PIECE.AUDIO_DIR + pieceName + PIECE.AUDIO_EXT;
}

})();
