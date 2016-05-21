
// Automatically load first level on document ready
var AUTO_LOAD_LEVEL_ON_DOCUMENT_READY = true;

// True = Loads level string from backend;
// False = Loads from LEVELS_STRING (at the end of global.js -- this file)
var LOAD_LEVEL_FROM_BACKEND = false;

// For scripts to attach public functions to
// See bottom of "Public Functions" in the load scripts
var sr = {};

// ----------------------------------------------------------
//    P I E C E S ,   A U D I O ,   E A S T E R   E G G
// ----------------------------------------------------------

var PIECE = {
    ANIMALS: [
        [], [], // Index (size) 0, 1 empty. No animals of that size.
        ['zebra', 'lion'],
        ['elephant', 'giraffe']
    ],

    IMG_DIR:          'images/animals/',
    IMG_EXT:          '.png',

    AUDIO_SPRITE_URL: 'audio/audioSprite.mp3',
};

var VOLUME_ICON = {
    ON:  'images/volume_on.gif',
    OFF: 'images/volume_off.gif'
};

// Position and duration info for audio sprite
// Join audio files: http://audio-joiner.com/
var AUDIO = [];
AUDIO['zebra']    = {start: 0.01, duration: 1.02};
AUDIO['lion']     = {start: 0.01, duration: 1.02};
AUDIO['elephant'] = {start: 0.01, duration: 1.02};
AUDIO['giraffe']  = {start: 0.01, duration: 1.02};
AUDIO['jeep']     = {start: 0.01, duration: 1.02};
AUDIO['easter']   = {start: 1.05, duration: 2.9};

var EASTER_EGG = {
    CLICKS_NEEDED:  10,    // # of consecutive clicks to activate
    CLICK_SPEED:    400,   // Consecutive click speed in ms
};

// ----------------------------------------------------------
//    D I V   I D s   &   P I E C E   C L A S S N A M E S
// ----------------------------------------------------------

var DIV_ID = {

    // Board and mechanics
    BOARD:          'gameBoard',
    NUM_MOVES:      'numMoves',
    TIMER:          'timerDisplay',
    MUTE_BUTTON:    'volume',

    // Level Complete Modal
    LEVEL_COMPLETE_MODAL:   'levelCompleteModal',
    NEXT_LEVEL_BUTTON:      'nextLevelBtn',
    RANDOM_LEVEL_BUTTON:    'randomLevelBtn',
    SUBMIT_SCORE_BUTTON:    'submitScoreBtn',
    PLAYER_NAME_INPUT:      'playerNameInput',

    JEEP:           'jeep'
};

var PIECE_CLASSNAME = {
    ALL:        'piece',
    HORIZONTAL: 'dragX',
    VERTICAL:   'dragY',
    SIZE:       ['', '', 'size2', 'size3']
};

// ----------------------------------------------------------
//             S C O R I N G   A N D   L E V E L S
// ----------------------------------------------------------

var SCORING = {
    DIFFICULTY_MULTIPLIER:  100,
    MOVES_MULTIPLIER:       0.98,
    SECONDS_MULTIPLIER:     0.999
};

var TOTAL_LEVELS = 40;

// ----------------------------------------------------------
//                          A J A X
// ----------------------------------------------------------

var AJAX_URL = {
    GET_LEVEL:      'http://team23.site88.net/db/getLevel.php',
    SUBMIT_SCORE:   'http://team23.site88.net/db/submitScore.php',
    LEADERBOARD:    'http://team23.site88.net/leaderboard.php'
};

// Gets and returns response to callback() using AJAX
sr.ajaxGet = function(url, callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            callback(xhttp.responseText);
        }
    };
    xhttp.open("GET", url);
    xhttp.send();
}

// ----------------------------------------------------------
//        D O M   O B J E C T S   R E F E R E N C E S
// ----------------------------------------------------------

// Board and mechanics
var BOARD;
var NUM_MOVES;
var TIMER;
var MUTE_BUTTON;

// Level Complete Modal
var LEVEL_COMPLETE_MODAL;
var NEXT_LEVEL_BUTTON;
var RANDOM_LEVEL_BUTTON;
var SUBMIT_SCORE_BUTTON;
var PLAYER_NAME_INPUT;

// Initialize variables on document ready
$(document).ready(function() {
    BOARD       = $('#' + DIV_ID.BOARD);
    NUM_MOVES   = $('#' + DIV_ID.NUM_MOVES);
    TIMER       = $('#' + DIV_ID.TIMER);
    MUTE_BUTTON = $('#' + DIV_ID.MUTE_BUTTON);

    LEVEL_COMPLETE_MODAL    = $('#' + DIV_ID.LEVEL_COMPLETE_MODAL);
    NEXT_LEVEL_BUTTON       = $('#' + DIV_ID.NEXT_LEVEL_BUTTON);
    RANDOM_LEVEL_BUTTON     = $('#' + DIV_ID.RANDOM_LEVEL_BUTTON);
    SUBMIT_SCORE_BUTTON     = $('#' + DIV_ID.SUBMIT_SCORE_BUTTON);
    PLAYER_NAME_INPUT       = $('#' + DIV_ID.PLAYER_NAME_INPUT);
});

// ----------------------------------------------------------
//                L E V E L S   S T R I N G
// ----------------------------------------------------------

// For detailed explanation, see loadLevel.js header
// Used only when LOAD_LEVELS_FROM_BACKEND = false
var LEVELS_STRING = ['',

    // Level 1 - 5
    '1,6,5,2,0021,5013,0113,3113,1221j,0412,4421,2531',
    '2,6,5,2,0012,3031,3112,5113,0221j,4212,0331,2412,4421,0521,3521',
    '3,6,5,2,1221j,3213,1321,5313,1412,2521',
    '4,6,5,2,0013,3013,1221j,2312,3331,5412,2531',
    '5,6,5,2,0021,3013,5012,0113,4113,1221j,5212,1331,0412,4421,4521',

    // Level 6-10
    '6,6,5,2,0021,0121,0321,0412,1221j,2312,3012,3213,3531,4113,5113',
    '7,6,5,2,1012,2021,4012,5012,3112,1221j,5212,2321,3412',
    '8,6,5,2,0221j,0321,0421,0521,2121,2212,2412,3021,3212,3431,3531,4112,4321,5013',
    '9,6,5,2,0221j,0313,1012,1331,2021,2412,3112,4021,4121,4213,5212,5412',
    '10,6,5,2,0021,0121,0213,0521,2012,1221j,1331,3412,4021,4421,4521,5113',

    // Level 11-15
    '11,6,5,2,1221j,0013,1021,3013,2312,3331,5412,2531',
    '12,6,5,2,0221j,0012,1021,5013,2113,3331,4412,0531',
    '13,6,5,2,3221j,0021,2021,4012,2112,5113,1212,0313,3321,3412,4421,1521,4521',
    '14,6,5,2,2221j,0021,2012,4121,0212,1212,2221,2321,4212,5212,2412,4421,0521',
    '15,6,5,2,2221j,1021,3021,0121,2121,4113,5113,0213,1213,2312,3312,4421,1521,3521',

    // Level 16-20
    '16,6,5,2,3221j,0021,2021,4012,5013,0112,2121,1212,2213,3331,0521',
    '17,6,5,2,0221j,0012,1031,2121,4121,2212,0321,0431,0531,3313,4412,5412',
    '18,6,5,2,1221j,0021,0121,2012,3013,0213,1331,1421,0531',
    '19,6,5,2,2221j,2012,3021,4112,1212,2321,4312,1431',
    '20,6,5,2,0221j,0012,3031,1121,3112,2212,5213,2412,3421,3531',

    // Level 21-25
    '21,6,5,2,1221j,0021,2012,3013,0113,1331,3531',
    '22,6,5,2,1221j,0112,2012,3031,3113,4121,1312,4321,0412,2421,5412,1531',
    '23,6,5,2,3221j,2031,5013,2112,3121,2312,3312,4321,4421,2531',
    '24,6,5,2,2221j,0212,1112,2012,3021,1321,4212,0431,0521,4412',
    '25,6,5,2,1221j,0021,0121,2012,4021,5113,0213,4212,1331,1412,3412,4421,4521',

    // Level 26-30
    '26,6,5,2,1221j,3031,0112,3112,4113,5212,0312,1331,2412,5412,3521,1012',
    '27,6,5,2,0221j,0012,1021,1121,3013,2212,3321,5213,2412,3531',
    '28,6,5,2,0221j,0031,3012,4121,2113,0312,1312,3321,5313,2431,0521,2521',
    '29,6,5,2,0221j,0031,4013,2112,5212,0312,1321,1421,3321,3412,5412,0531',
    '30,6,5,2,1221j,0013,2012,3031,3112,0321,2321,5313,0521,2521',

    // Level 31-35
    '31,6,5,2,1221j,0021,3031,3112,4121,0212,5213,2313,3321,0421,3531',
    '32,6,5,2,0221j,0021,2013,3012,4021,0312,1321,3321,5313,3412,0521',
    '33,6,5,2,0221j,1012,2013,4021,0312,1321,3321,5313,1421,3412,4412,0531',
    '34,6,5,2,0221j,0012,3031,3112,5113,4212,0331,3312,2412,4421,0521,3521',
    '35,6,5,2,0221j,2013,3021,5013,3112,0312,1331,1421,3412,4412,0521',

    // Level 36-40
    '36,6,5,2,2221j,0013,1031,4021,1112,2121,5113,0331,3312,2412,4421,0521',
    '37,6,5,2,1221j,0021,2012,4021,0121,4113,5113,0213,1331,3412,4421,4521,0521',
    '38,6,5,2,0221j,0012,3031,1121,3112,2212,5213,3321,2412,3421,3531',
    '39,6,5,2,0221j,2012,3031,3112,2212,5213,0321,3321,0412,1412,2421,2521',
    '40,6,5,2,3221j,0013,1021,4012,1112,2112,5113,0331,3312,2412,4421,0521,3521'
];
