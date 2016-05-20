/*
 * Controls whether there is audio when playing the game.
 *
 * Requires:
 *     - jQuery         [http://jquery.com/]
 */

(function() {
    
    // Current/last audio object that played
    var audioPlaying;
    
    // State of mute button
    var muted = false;

    // Toggles mute button image
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
    
    // Cuts off audio when mute button pressed
    function pauseAudio() {
        if (audioPlaying) {
            audioPlaying.pause();
        }
    }

    // Set currently playing audio
    function setPlayingAudio(audio) {
        audioPlaying = audio;
    }

    // Checks if volume is muted
    function isMuted() {
        return muted;
    }
    
    // Attach public function to global sr object
    window.sr.isMuted         = isMuted;
    window.sr.muteToggle      = muteToggle;
    window.sr.setPlayingAudio = setPlayingAudio;

})();
