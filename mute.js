var tracks = [];

$('#soundTest').click(function() {
    soundTest = new Audio();
    soundTest.src = "http://www.sounddogs.com/previews/4006/mp3/209105_SOUNDDOGS__up.mp3";
    soundTest.play();
    tracks.push(soundTest);
});



$('#volume').click(function() {
    if (tracks[0].muted == true) {
        for(var i=0; i<tracks.length; i++){
            tracks[i].muted = false;
        }
    } else {
        for(var j=0; j<tracks.length; j++){
            tracks[j].muted = true;
        }
    }
    /* Check length of array */
    console.log(tracks.length);
});