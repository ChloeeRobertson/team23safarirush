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
    timeoutInstance,
    audioSprite;

var
    lockAudio             = false; // Locks audio while easter egg playing

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
    if (!audioSprite) {
        initiateAudioSprite();
    }

    if (piece.isJeep) {
        var animal = DIV_ID.JEEP;
        loadJeepAssets(pieceElement);
    } else {
        var animal = getRandomAnimalName(piece);
    }

    loadAssets(pieceElement, animal);
}

// Attach public functions to global sr object
window.sr.loadPieceAssets = loadPieceAssets;

// ----------------------------------------------------------
//               C O R E   F U N C T I O N S
// ----------------------------------------------------------

/**
 * Load jeep-only assets.
 */
function loadJeepAssets(pieceElement) {
    pieceElement
        .on('mousedown touchstart', function() {
            easterEgg();
        })

        // Used for checkWin() in loadMechanics.js
        .attr('id', DIV_ID.JEEP);
}

/**
 * Load assets for all animals and the jeep.
 */
function loadAssets(pieceElement, pieceName) {
    pieceElement
        .append('<img src="' + getImgUrl(pieceName) + '">')
        .on('mousedown touchstart', function() {
            playAudio(pieceName);
        });
}

/**
 * Easter Egg.
 */
function easterEgg() {

    // Audio locked, do nothing
    if (lockAudio) {
        return;
    }

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
        playAudio('easter');

        lockAudio             = true;
        easterEggClickCounter = 0;

        setTimeout(function() {
            lockAudio = false;
        }, AUDIO['easter'].duration * 1000);
    }

    easterEggLastClick = event.timeStamp;
}

// ----------------------------------------------------------
//            H E L P E R   F U N C T I O N S
// ----------------------------------------------------------

/**
 * Initiate audio sprite.
 */
function initiateAudioSprite() {
    audioSprite     = new Audio();
    audioSprite.src = PIECE.AUDIO_SPRITE_URL;
}

/**
 * Plays piece's sound.
 */
function playAudio(pieceName) {

    // Audio locked, do nothing
    if (lockAudio) {
        return;
    }

    // Play sound if not muted
    if (!sr.isMuted()) {
        var startPosition = AUDIO[pieceName].start;
        var playDuration  = AUDIO[pieceName].duration;

        clearTimeout(timeoutInstance);

        audioSprite.currentTime = startPosition;
        audioSprite.play();

        timeoutInstance = setTimeout(function() {
            audioSprite.pause();
        }, playDuration * 1000);
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

})();
