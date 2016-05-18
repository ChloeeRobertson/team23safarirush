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
    totalScore      = 0;

// ----------------------------------------------------------
//               C O R E   F U N C T I O N S
// ----------------------------------------------------------

/**
 * Mark level as complete and add level score to total score.
 */
function addToScore(level, numMoves, secondsTaken) {
    var difficulty = parseInt((level / 10) + 1);
    // var multiplier = ;

    totalScore = (SCORING.DIFFICULTY_MULTIPLIER * difficulty) *
         (SCORING.MOVES_MULTIPLIER * numMoves) *
         (SCORING.SECONDS_MULTIPLIER * secondsTaken);

    level = parseInt(level);

    console.log('lvl: ' + level + ', difficulty: ' + difficulty + ', moves: ' + numMoves + ', sec: ' + secondsTaken + ', score: ' + totalScore);
}

/**
 * Submit score to leaderboard.
 */
function submitScore() {
    var submitScoreURL = AJAX_URL.SUBMIT_SCORE + '?name=' + getPlayerName() + '&score=' + score;
    // sr.ajaxGet(submitScoreURL, loadLevelFromString);
}

// ----------------------------------------------------------
//            H E L P E R   F U N C T I O N S
// ----------------------------------------------------------

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