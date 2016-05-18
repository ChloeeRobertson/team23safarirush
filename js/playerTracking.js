/*
 * Tracks player's score and levels completed.
 *
 * Must be loaded after global.js and loadLevel.js
 *
 * Requires:
 *     - jQuery         [http://jquery.com/]
 */

(function() {

var
    levelsCompleted = [],
    totalScore      = 0;

// ----------------------------------------------------------
//               C O R E   F U N C T I O N S
// ----------------------------------------------------------

/**
 * Mark level as complete and add level score to total score.
 */
function addToScore(level, numMoves, secondsTaken) {
    var level                = parseInt(level);
    var difficulty           = parseInt((level / 10) + 1);
    var difficultyMultiplier = SCORING.DIFFICULTY_MULTIPLIER * difficulty;
    var movesMultiplier      = Math.pow(SCORING.MOVES_MULTIPLIER, numMoves);
    var secondsMultiplier    = Math.pow(SCORING.SECONDS_MULTIPLIER, secondsTaken);

    levelsCompleted[level] = true;
    totalScore = difficultyMultiplier * movesMultiplier * secondsMultiplier;

    console.log('lvl: ' + level + ', difficulty: ' + difficulty + ', moves: ' + numMoves + ', sec: ' + secondsTaken + ', score: ' + totalScore);
}

/**
 * Submit score to leaderboard.
 */
function submitScore() {
    var submitScoreURL = AJAX_URL.SUBMIT_SCORE + '?name=' + getPlayerName() + '&score=' + score;
    // sr.ajaxGet(submitScoreURL, loadLevelFromString);
}

function getRandomLevel() {
    
}

// ----------------------------------------------------------
//            H E L P E R   F U N C T I O N S
// ----------------------------------------------------------

function initLevels() {
    for (var lvl = 0; lvl <= TOTAL_LEVELS;) {}
}

/**
 * Get player name from input element.
 */
function getPlayerName() {
    return $('#' + DIV_ID.PLAYER_NAME).val();
}

// Attach public functions to global sr object
window.sr.addToScore  = addToScore;
window.sr.submitScore = submitScore;

})();