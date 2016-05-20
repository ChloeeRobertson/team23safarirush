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
    audio = [];     // Stores all audio objects

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
    audio = [];
}

// Attach public functions to global sr object
window.sr.loadPieceAssets   = loadPieceAssets;
window.sr.clearAudioObjects = clearAudioObjects;

// ----------------------------------------------------------
//               C O R E   F U N C T I O N S
// ----------------------------------------------------------

/**
 * Load jeep assets.
 */
function loadJeepAssets(pieceElement) {
    pieceElement
        .attr('id', DIV_ID.JEEP) // Used for checkWin() in loadMechanics.js
        .append('<img src="' + getImgUrl(DIV_ID.JEEP) + '">')
        .on('click touchstart', function() {
            var audioIndex = addAudioBySource(EASTER_EGG.AUDIO_SRC);
            easterEgg(audioIndex);
        });
}

/**
 * Load animal assets.
 */
function loadAnimalAssets(pieceElement, animalName) {
    pieceElement
        .append('<img src="' + getImgUrl(animalName) + '">')
        .on('click touchstart', function() {
            var audioIndex = addAudioByPieceName(animalName);
            playAudio(audioIndex);
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
 * Add audio object to 'audio' array and returns the
 * index position of the newly added audio object.
 */
function addAudioByPieceName(pieceName) {
    var audioSource = getAudioUrl(pieceName);
    return addAudioBySource(audioSource);
}

/**
 * Adds new audio object to the 'audio' array and returns the
 * index position of the newly added audio object.
 */
function addAudioBySource(source) {
    var newAudio = new Audio();
    newAudio.src = source;

    audio.push(newAudio);
    return audio.length - 1;
}

/**
 * Stops currently playing audio and plays another file.
 */
function playAudio(audioIndex) {
    if (!sr.isMuted()) {
        stopOtherAudio(audioIndex);
        audio[audioIndex].currentTime = 0.1;
        audio[audioIndex].play();
        // tracks.push(audio);
        sr.setPlayingAudio(audio[audioIndex]);
    }
}

/**
 * Stops all other audio objects.
 */
function stopOtherAudio(audioIndex) {
    for (var i = 0; i < audio.length; i++) {
        if (i !== audioIndex) {
            audio[i].pause();
        }
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
