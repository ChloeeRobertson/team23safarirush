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
    muted = false,  // Is volume muted?
    timeoutInstance,
    audioSprite = new Audio();
    audioSprite.src = PIECE.AUDIO_SPRITE_URL;

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
function loadPieceAssets(piece, pieceElement) {
    if (piece.isJeep) {
        loadJeepAssets(pieceElement);
    } else {
        var animal = getRandomAnimalName(piece);
        loadAnimalAssets(pieceElement, animal);
    }
}

/**
 * Resets audio objects for new level.
 */
function clearAudioObjects() {
    // audio = [];
}

// Attach public functions to global sr object
window.sr.loadPieceAssets   = loadPieceAssets;
window.sr.clearAudioObjects = clearAudioObjects;

// ----------------------------------------------------------
//               C O R E   F U N C T I O N S
// ----------------------------------------------------------

/**
 * Load jeep-only assets.
 */
function loadJeepAssets(pieceElement) {
    pieceElement
        .attr('id', DIV_ID.JEEP) // Used for checkWin() in loadMechanics.js
        .append('<img src="' + getImgUrl(DIV_ID.JEEP) + '">')
        .on('click touchstart', function() {
            // var audioIndex = addAudioBySource(EASTER_EGG.AUDIO_SRC);
            // easterEgg(audioIndex);
        });
}

/**
 * Load animal-only assets.
 */
function loadAnimalAssets(pieceElement, animalName) {
    pieceElement
        .append('<img src="' + getImgUrl(animalName) + '">')
        .on('click touchstart', function() {
            playAudio(animalName);
        });
}

/**
 * Easter Egg.
 */
function easterEgg(audioIndex) {
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
        playAudio(audioIndex);
    }

    easterEggLastClick = event.timeStamp;
}

// ----------------------------------------------------------
//            H E L P E R   F U N C T I O N S
// ----------------------------------------------------------

/**
 * Plays piece's sound.
 */
function playAudio(pieceName) {
    if (!muted) {
        clearTimeout(timeoutInstance);

        audioSprite.currentTime = AUDIO[pieceName].start;
        audioSprite.play();

        timeoutInstance = setTimeout(function() {
            audioSprite.pause();
        }, AUDIO[pieceName].length * 1000);
        // tracks.push(audio);
    }
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

/**
 * Get a piece's audio URL.
 */
function getAudioUrl(pieceName) {
    return PIECE.AUDIO_DIR + pieceName + PIECE.AUDIO_EXT;
}

})();
