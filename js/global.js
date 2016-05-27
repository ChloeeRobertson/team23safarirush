
// Automatically load board on document ready
var AUTO_LOAD_BOARD_ON_DOCUMENT_READY = true;

// True = Loads level string from backend;
// False = Loads from LEVELS_STRING (at the end of global.js -- this file)
var LOAD_LEVEL_FROM_BACKEND = false;

// ----------------------------------------------------------
//    P I E C E S ,   E A S T E R   E G G ,   A U D I O
// ----------------------------------------------------------

// Duration (in ms) of Jeep exit animation played after a level is completed
var JEEP_EXIT_ANIMATION_DURATION = 1200;

var PIECE = {

    // Safari animals sorted by size
    // Index [0] = size 0; [1] = size 1; [2] = size 2 ...
    ANIMALS: [
        [], [], // Index (size) 0, 1 empty. No animals of that size.
        ['zebra', 'lion'],
        ['elephant', 'giraffe']
    ],

    // Image directory and extention of piece images
    IMG_DIR: 'images/animals/',
    IMG_EXT: '.png'
};

// Audio sprite file (contains every single sound used in game)
var AUDIO_SPRITE_URL = 'audio/audioSprite_130kb.mp3';

var EASTER_EGG = {
    CLICKS_NEEDED:  10,    // # of consecutive clicks to activate
    CLICK_SPEED:    400   // Consecutive click speed in ms
};

var VOLUME_ICON = {
    ON:  'images/volume_on.gif',
    OFF: 'images/volume_off.gif'
}

// Position and duration info for audio sprite
// Join audio files: http://audio-joiner.com/
// Cut audio files:  http://mp3cut.net/
// Reduce MP3 files: http://www.mp3smaller.com/
var AUDIO = [];
AUDIO['easter'] = [
    {start: 0.2,  duration: 3.0}    // crocHunter_WOOHOO.wav
    ];
AUDIO['giraffe'] = [
    {start: 4.1,  duration: 1.4},   // giraffe_handnoise.mp3
    {start: 6.5,  duration: 1.3}    // giraffe_name.mp3
    ];
AUDIO['jeep'] = [
    {start: 8.7,  duration: 0.5},   // jeepBeepBeep.mp3
    {start: 10.0, duration: 0.7},   // jeepHereWeGo1.mp3
    {start: 11.5, duration: 2.0},   // jeepIdle2.mp3
    {start: 14.3, duration: 1.4}    // jeepVroom.mp3
    ];
AUDIO['win'] = [
    {start: 16.5, duration: 1.2}    // jeepWoohoo.mp3
    ];
AUDIO['lion'] = [
    {start: 18.4, duration: 0.9},   // lion_bored.mp3
    {start: 20.2, duration: 0.6},   // lion_clueless.mp3
    {start: 21.6, duration: 1.4}    // lion_loud.mp3
    ];
AUDIO['elephant'] = [
    {start: 23.9, duration: 2.0},   // WyattElephant1.mp3
    {start: 26.9, duration: 2.5}    // WyattElephant2.mp3
    ];
AUDIO['zebra'] = [
    {start: 30.2, duration: 1.0},   // zebra1.mp3
    {start: 32.2, duration: 0.8}    // zebra2.mp3
    ];

// ----------------------------------------------------------
//        P I E C E   I D s   &   C L A S S N A M E S
// ----------------------------------------------------------

// Used for Easter Egg
var JEEP_ID = 'jeep';

// Classnames for different pieces
// e.g. horizontal size-2 piece will have classes: "piece dragX size2"
var PIECE_CLASSNAME = {
    ALL:                    'piece',
    HORIZONTAL:             'dragX',
    VERTICAL:               'dragY',
    SIZE:                   ['', '', 'size2', 'size3']
};

// ----------------------------------------------------------
//  A C H I E V E M E N T S ,   S C O R I N G ,   L E V E L S
// ----------------------------------------------------------

// Message shown after player beats all levels
var GAMEWON_MESSAGE = "Safari God! Submit your score!";

// Duration (seconds) to show achievement notification for
var ACHIEVEMENT_NOTIFICATION_SHOWN_FOR = 4;

// Sorted by index (difficulty)
// Index [0] = difficulty 0; [1] = difficulty 1 ...
var ACHIEVEMENT_ICONS = [
    'images/badges/zebraBadge.png',     // Easy levels
    'images/badges/lionBadge.png',      // Intermediate levels
    'images/badges/giraffeBadge.png',   // Advanced levels
    'images/badges/elephantBadge.png',  // Expert levels
    'images/badges/godBadge.png'        // All levels
];

// Sorted by index (difficulty)
// Index [0] = difficulty 0; [1] = difficulty 1 ...
var ACHIEVEMENT_TITLES = [
    'Grass Badge',
    'Bronze Badge',
    'Silver Badge',
    'Gold Badge',
    'Safari God'
];

// Sorted by index (difficulty)
// Index [0] = difficulty 0; [1] = difficulty 1 ...
var LEVEL_DIFFICULTY = [
    'Easy',         // 1 - 10
    'Intermediate', // 11 - 20
    'Advanced',     // 21 - 30
    'Expert',       // 31 - 40
    '',             // 1 - 40
];

// Used to calculate scoring algorithm
var SCORING = {

    // Lessens scoring bias against long level completion time
    // and high # of moves for higher levels.
    // (higher factor = time & # of moves has less impact in later levels)
    LEVEL_EASE_FACTOR:      .5,

    // Multiplied by level # (higher # = higher score on later levels)
    LEVEL_MULTIPLIER:       .8,

    // Multiplied by difficulty # (higher # = higher score on higher difficulty levels)
    DIFFICULTY_MULTIPLIER:  100,

    // Deductive multipliers
    // More moves & time taken = lower score
    MOVES_MULTIPLIER:       0.98,
    SECONDS_MULTIPLIER:     0.999
};

// Used for comparing user scores to player averages
var SCORING_COMPARISON_FACTOR = {
    NUM_MOVES:    .15,  // +/- 15% of average is still average
    SECONDS_USED: .15   // +/- 15% of average is still average
};

// Variable to store total number of board arrangements
var TOTAL_LEVELS = 40;

var LEVEL_SELECTOR_DELAY = {

    // Delayed animation to current level due to bootstraps slow modal pop-up
    // Animation won't work unless the level selector modal is fully loaded
    ANIMATE_TO_LEVEL:          850,

    // Once level completes, shows the completed level statistics for x amount of time
    // Then animates to the next level after
    SHOW_COMPLETED_LEVEL_FOR:  2000,

    // Once player beats all level, a game won message will be shown for x amount of time
    // Then the level selector will pop-up displaying all level statistics
    // And allows user to submit his/her score
    SHOW_GAME_WON_MESSAGE_FOR: 3500
};

// ----------------------------------------------------------
//                    A J A X   U R L
// ----------------------------------------------------------

var AJAX_URL = {
    GET_LEVEL:           'http://team23.site88.net/db/getLevel.php',
    GET_SCORE_AVERAGES:  'http://team23.site88.net/db/getScoreAverages.php',
    SUBMIT_SCORE:        'http://team23.site88.net/db/submitScore.php',
    SUBMIT_LEVEL_STATS:  'http://team23.site88.net/db/submitLevelStats.php',
    LEADERBOARD:         'http://team23.site88.net/leaderboard.php'
};

// ----------------------------------------------------------
//        D O M   O B J E C T S   R E F E R E N C E S
// ----------------------------------------------------------

// Board and mechanics
var BORDER;
var BOARD;
var BLACKOUT;
var NUM_MOVES;
var TIMER;
var SCORE_DISPLAY;
var ACHIEVEMENTS;

// Level selector modal
var LEVEL_SELECTOR_MODAL;
var LEVEL_SELECTOR_CONTAINER;
var LEVEL_SELECTOR_BUTTON;
var RANDOM_LEVEL_BUTTON;
var SUBMIT_SCORE_BUTTON;
var PLAYER_NAME_INPUT;

// Used to show notifications and messages
var MESSAGING_MODAL;

var MUTE_BUTTON;
var RESET_BUTTON;

// Initialize variables on document ready
$(document).ready(function() {

    BORDER        = $('#gameBorder');
    BOARD         = $('#gameBoard');
    BLACKOUT      = $('#blackout');
    NUM_MOVES     = $('#numMoves');
    TIMER         = $('#timerDisplay');
    SCORE_DISPLAY = $('#scorePoints');
    ACHIEVEMENTS  = $('#achievements');

    LEVEL_SELECTOR_MODAL     = $('#levelSelectorModal');
    LEVEL_SELECTOR_CONTAINER = $('#levelSelectorContainer');
    LEVEL_SELECTOR_BUTTON    = $('#levelSelectionButton');
    RANDOM_LEVEL_BUTTON      = $('#randomLevelBtn');
    SUBMIT_SCORE_BUTTON      = $('#submitScoreBtn');
    PLAYER_NAME_INPUT        = $('#playerNameInput');
    
    MESSAGING_MODAL          = $('#messagingModal');

    MUTE_BUTTON  = $('#volume');
    RESET_BUTTON = $('#levelResetButton');
});

// ----------------------------------------------------------
//                 L E V E L   S T R I N G
// ----------------------------------------------------------

// For detailed explanation, see Board.js header
// Used only when LOAD_LEVEL_FROM_BACKEND = false

var LEVEL_STRING = ['',

    // Level 1 - 5
    // '1,6,5,2,1221j', // Only Jeep piece showing, used for testing
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
    '14,6,5,2,2221j,0021,2012,4121,0212,1212,2321,4212,5212,2412,4421,0521',
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