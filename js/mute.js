$(document).ready(function(){

/* Array storing each audio variable */
var tracks = [];
/* State of mute button */
sound = true;

/* Audio variables */
var sound1 = new Audio();
sound1.src = "audio/crocodile_man.wav";
tracks.push(sound1);

var sound2 = new Audio();
sound2.src = "audio/havoc.wav";
tracks.push(sound2);

/* Functions to play sounds */
$("#soundTest").click(function() {
    if (sound === true) {
        isPlaying(sound1);
        sound1.play();
    }
});

$("#soundTest2").click(function() {
    if (sound === true) {
        isPlaying(sound2);
        sound2.play();
    }
});

/* Checks if sound is currently playing */
function isPlaying(sound) {
    if (sound.currentTime > 0) {
        sound.pause();
        sound.currentTime = 0;
    }
}

/* Mute button: checks sound variable then mutes or unmutes the tracks */
$('#volume').click(function mute() {
    if (sound === true) {
        sound = false;
    } else if (sound === false) {
        sound = true;
    }
    return sound;

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

});



