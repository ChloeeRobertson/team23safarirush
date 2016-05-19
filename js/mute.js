$(document).ready(function(){

// Array storing each audio variable
tracks = [];

// State of mute button
sound = true;

// Mute button: checks sound variable then mutes or unmutes the tracks
$('#' + DIV_ID.MUTE).click(function mute() {
    if (sound === true) {
        sound = false;
    } else if (sound === false) {
        sound = true;
    }

    if (tracks[0].muted === true) {
        for(var i=0; i<tracks.length; i++){
            tracks[i].muted = false;
        }
    } else {
        for(var j=0; j<tracks.length; j++){
            tracks[j].muted = true;
        }
    }
});

// Resets array anytime loadLevel() is called
function clearArray() {
    tracks.length = 0;
}

// Attach public function to global sr object
window.sr.clearArray    = clearArray;
});



