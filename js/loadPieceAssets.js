/*
 * Loads pieces' (jeep and animal) images and sounds.
 * 
 * Must be loaded after global.js and loadLevel.js
 *
 * Requires:
 *     - jQuery         [http://jquery.com/]
 */

(function() {

// Audio
var
    timeoutInstance,      // Used to stop audioSprite once playDuration is played through
    audioSprite,          // Audio sprite (1 file) storing all pieces' sounds
    audioLocked = false;  // Locks audio while a sound is playing

// Cheap animation
var
    shrinkWidthSizePx,    // Amount of px to shrink image when tapping animals
    shrinkPositionSizePx, 
    shrunkenImage,        // Reference to the current shrunken image
    shrunkenImageMovesHorizontally;

// Easter Egg
var
    // Used for Desktop clicks only
    easterEggClickCounter = 0,    // Counts # of clicks in succession
    easterEggLastClick    = 0;    // Last click timestamp

// ----------------------------------------------------------
//               P U B L I C   F U N C T I O N S
// ----------------------------------------------------------

/**
 * Initiate audio sprite object.
 */
function initializeSharedPieceAssets() {
    var shrinkSizePx     = Math.floor(BOARD.width() * 0.02);
    shrinkWidthSizePx    = shrinkSizePx * 2;
    shrinkPositionSizePx = shrinkSizePx / 2;

    audioSprite          = new Audio();
    audioSprite.src      = PIECE.AUDIO_SPRITE_URL;

    // Tell mute.js what audio sprite file will be played
    sr.setPlayingAudio(audioSprite);
}

/**
 * Loads piece assets.
 */
function loadPieceAssets(piece, pieceElement) {
    if (piece.isJeep) {
        var animal = JEEP_ID;
        loadJeepAssets(pieceElement);
    } else {
        var animal = getRandomAnimalName(piece);
    }

    var movesHorizontally = piece.w > piece.h;
    loadAssets(pieceElement, animal, movesHorizontally);
}

/**
 * Plays piece's sound.
 */
function playAudio(pieceName, overrideOtherSounds) {

    // Audio locked or muted, do nothing, unless overriding
    if (sr.isMuted() || (!overrideOtherSounds && audioLocked)) {
        return;
    }
    audioLocked = true;

    var randomIndex   = Math.floor(AUDIO[pieceName].length * Math.random());
    var startPosition = AUDIO[pieceName][randomIndex].start;
    var playDuration  = AUDIO[pieceName][randomIndex].duration;

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
window.sr.initializeSharedPieceAssets = initializeSharedPieceAssets;
window.sr.loadPieceAssets             = loadPieceAssets;
window.sr.playAudio                   = playAudio;

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
            playAudio(pieceName);
            shrinkImage(pieceElement.children(), movesHorizontally);
        });
    BOARD.on('mouseup touchend', function() {
            autoUnshrinkImage();
        });
}

/**
 * Easter Egg: click Jeep 10 times to activate.
 */
function easterEgg() {
    var overrideOtherSounds = true;
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
        playAudio('easter', overrideOtherSounds);
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

})();
