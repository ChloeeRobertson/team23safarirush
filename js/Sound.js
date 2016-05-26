/*
 * Controls whether there is audio when playing the game.
 *
 * Must be loaded after global.js and Board.js
 *
 * Requires:
 *     - jQuery         [http://jquery.com/]
 */

(function(global) {

var
    sprite      = null,     // Audio sprite
    locked      = false,    // Any audio playing now
    muted       = false,
    timeout     = null;     // Used to stop sprite from playing full length

// ----------------------------------------------------------
//               P U B L I C   F U N C T I O N S
// ----------------------------------------------------------
    
/**
 * Initializes audio functionality.
 */
function initialize() {
    sprite      = new Audio();
    sprite.src  = AUDIO_SPRITE_URL;

    MUTE_BUTTON.on('click', muteToggle);
}
    
/**
 * Play sound.
 */
function play(name, stopOtherSounds) {

    // Audio locked or muted, do nothing, unless overriding
    if (muted || (!stopOtherSounds && locked)) {
        return;
    }
    locked = true;

    var randomIndex   = Math.floor(AUDIO[name].length * Math.random());
    var startPosition = AUDIO[name][randomIndex].start;
    var playDuration  = AUDIO[name][randomIndex].duration;

    clearTimeout(timeout);

    sprite.currentTime = startPosition;
    sprite.play();

    // Stop audio once playDuration passed
    timeout = setTimeout(function() {
        sprite.pause();
        locked = false;
    }, playDuration * 1000);
}

// Make public functions go public
global.Sound = {
    initialize:     initialize,
    play:           play
};

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

        sprite.pause();
    }

    MUTE_BUTTON.attr('src', volumeIconUrl);
}

// ----------------------------------------------------------
//            H E L P E R   F U N C T I O N S
// ----------------------------------------------------------

})(window);
