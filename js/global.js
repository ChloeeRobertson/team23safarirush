

var AUTO_LOAD_LEVEL_ON_DOCUMENT_READY = true;

// For scripts to attach public functions to
// See bottom of "Public Functions" in the load scripts
var sr = {};


/*
 * Animals and Easter Egg
 **************************/

var PIECE = {
    LIST: [
        [], [], // Index (size) 0, 1 empty. No animals of that size.
        ['zebra', 'lion'],
        ['elephant', 'giraffe']
    ],

    JEEP_IMG_NAME:  'jeep',

    IMG_DIR:        'images/animals/',
    IMG_EXT:        '.png',

    AUDIO_DIR:      'audio/animals/',
    AUDIO_EXT:      '.wav'
};

var EASTER_EGG = {
    CLICKS_NEEDED:  10,    // # of consecutive clicks to activate
    CLICK_SPEED:    400,   // Consecutive click speed in ms
    AUDIO_SRC:      'audio/CrocHunterCrikey3.wav'
};

/*
 * DIV ID's and Classnames
 **************************/

var DIV_ID = {
    BOARD:          'gameBoard',
    JEEP:           'jeep',
    NUM_MOVES:      'numMoves',
    TIMER:          'timerDisplay',
    PLAYER_NAME:    'playerName',
    LEVEL_COMPLETE_MODAL: 'levelCompleteModal'
};

var PIECE_CLASSNAME = {
    ALL:        'piece',
    HORIZONTAL: 'dragX',
    VERTICAL:   'dragY',
    SIZE:       ['', '', 'size2', 'size3']
};

/*
 * Scoring
 **************************/

var SCORING = {
    DIFFICULTY_MULTIPLIER:  100,
    MOVES_MULTIPLIER:       0.98,
    SECONDS_MULTIPLIER:     0.999
};

/*
 * AJAX
 **************************/

var AJAX_URL = {
    GET_LEVEL:      'http://team23.site88.net/db/getLevel.php',
    SUBMIT_SCORE:   'http://team23.site88.net/db/submitScore.php'
};

// Gets and returns response to callback() using AJAX
function ajaxGet(url, callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            callback(xhttp.responseText);
        }
    };
    xhttp.open("GET", url);
    xhttp.send();
}

/*
 * DOM Objects and Related
 **************************/

var BOARD;
var NUM_MOVES;
var TIMER;

var BOARD_LENGTH_PX;

// Initialize variables on document ready
$(document).ready(function() {
    BOARD     = $('#' + DIV_ID.BOARD);
    NUM_MOVES = $('#' + DIV_ID.NUM_MOVES);
    TIMER     = $('#' + DIV_ID.TIMER);

    BOARD_LENGTH_PX = BOARD.width();
});
