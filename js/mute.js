$(document).ready(function(){

// Array storing each audio variable
tracks = [];

// State of mute button
sound = true;

// Mute button: checks sound variable then mutes or unmutes the tracks
$('#' + DIV_ID.MUTE).click(function mute() {
    if (sound === true) {
        cutAudio();
        sound = false;
    } else if (sound === false) {
        sound = true;
    }
});

// Toggles mute button image
function muteToggle() {

}

// Cuts off audio when mute button pressed
function cutAudio() {
    for (var i = 0; i < tracks.length; i++) {
        if (tracks[i].currentTime > 0) {
            tracks[i].pause();
        }
    }
}

// Resets array anytime loadLevel() is called
function clearArray() {
    tracks.length = 0;
}

// Attach public function to global sr object
window.sr.clearArray    = clearArray;
});



