$(document).ready(function(){
    
    // Array storing each audio variable
    // tracks = [];

    // Current/last audio object that played
    var audioPlaying;
    
    // State of mute button
    var sound = true;

    // Mute button: checks sound variable then mutes or unmutes the tracks
    MUTE_BUTTON.on('click', function mute() {
        if (sound === true) {
            cutAudio();
            muteToggle();
            sound = false;
        } else if (sound === false) {
            muteToggle();
            sound = true;
        }
    });

    // Toggles mute button image
    function muteToggle() {
        if (sound == false) {
            MUTE_BUTTON.attr('src', "images/volume_on.gif");
        } else {
            MUTE_BUTTON.attr('src', "images/volume_off.gif");
        }
    }
    
    // Cuts off audio when mute button pressed
    function cutAudio() {
        // for (var i = 0; i < tracks.length; i++) {
        //     if (tracks[i].currentTime > 0) {
        //         tracks[i].pause();
        //     }
        // }

        if (audioPlaying) {
            audioPlaying.pause();
        }
    }
    
    // Resets array anytime loadLevel() is called
    // function clearArray() {
    //     tracks.length = 0;
    // }

    // Set currently playing audio
    function setPlayingAudio(audio) {
        audioPlaying = audio;
    }

    // Checks if volume is muted
    function isMuted() {
        return !sound;
    }
    
    // Attach public function to global sr object
    window.sr.isMuted         = isMuted;
    window.sr.setPlayingAudio = setPlayingAudio;
    // window.sr.clearArray = clearArray;
});
