/*
 * Controls whether there is audio when playing the game.
 *
 * Requires:
 *     - jQuery         [http://jquery.com/]
 */

(function() {
    
var
    audioPlaying,  // Current/last audio object that played
    muted = false; // State of mute button

// ----------------------------------------------------------
//               P U B L I C   F U N C T I O N S
// ----------------------------------------------------------

/**
 * Activates mute toggle.
 */
function initializeMuteFunction() {
    MUTE_BUTTON.on('click', muteToggle);
}

/**
 * Set currently playing audio.
 */
function setPlayingAudio(audio) {
    audioPlaying = audio;
}

/**
 * Checks if volume is muted.
 */
function isMuted() {
    return muted;
}

// Attach public functions to global sr object
window.sr.initializeMuteFunction = initializeMuteFunction;
window.sr.isMuted                = isMuted;
window.sr.setPlayingAudio        = setPlayingAudio;

// ----------------------------------------------------------
//               C O R E   F U N C T I O N S
// ----------------------------------------------------------

/**
 * Toggles mute state.
 */
function muteToggle() {
    var volumeIconUrl;

    if (muted) {
        muted         = false;
        volumeIconUrl = VOLUME_ICON.ON;
    } else {
        muted         = true;
        volumeIconUrl = VOLUME_ICON.OFF;

        pauseAudio();
    }

    MUTE_BUTTON.attr('src', volumeIconUrl);
}

// ----------------------------------------------------------
//            H E L P E R   F U N C T I O N S
// ----------------------------------------------------------

/**
 * Cuts off audio when mute button pressed.
 */
function pauseAudio() {
    if (audioPlaying) {
        audioPlaying.pause();
    }
}

})();
