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
    timeoutInstance, // Used to pause audio once playDuration is played through
    audioSprite;     // Audio sprite (1 file) storing all pieces' sounds

var
    audioLocked           = false; // Locks audio while a sound is playing

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
        var animal = JEEP_ID;
        loadJeepAssets(pieceElement);
    } else {
        var animal = getRandomAnimalName(piece);
    }

    loadAssets(pieceElement, animal);
}

/**
 * Plays piece's sound.
 */
function playAudio(pieceName) {

    // Audio locked or muted, do nothing
    if (audioLocked || sr.isMuted()) {
        return;
    }
    audioLocked = true;

    var startPosition = AUDIO[pieceName].start;
    var playDuration  = AUDIO[pieceName].duration;

    clearTimeout(timeoutInstance);

    audioSprite.currentTime = startPosition;
    audioSprite.play();

    // Stop audio once playDuration passed
    timeoutInstance = setTimeout(function() {
        audioSprite.pause();
        audioLocked = false;
    }, playDuration * 1000);
}

// Attach public functions to global sr object
window.sr.loadPieceAssets = loadPieceAssets;
window.sr.playAudio       = playAudio;

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
 * Load image and add sound on click/tap for piece.
 */
function loadAssets(pieceElement, pieceName) {
    pieceElement
        .append('<img src="' + getImgUrl(pieceName) + '">')
        .on('mousedown touchstart', function() {
            playAudio(pieceName);
        });
}

/**
 * Easter Egg: click Jeep 10 times to activate.
 */
function easterEgg() {

    // Audio locked, do nothing
    if (audioLocked) {
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
        easterEggClickCounter = 0;
    }

    easterEggLastClick = event.timeStamp;
}

// ----------------------------------------------------------
//            H E L P E R   F U N C T I O N S
// ----------------------------------------------------------

/**
 * Initiate audio sprite object.
 */
function initiateAudioSprite() {
    audioSprite     = new Audio();
    audioSprite.src = PIECE.AUDIO_SPRITE_URL;

    // Tell mute.js what audio sprite file will be played
    sr.setPlayingAudio(audioSprite);
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
