/*
 * Tracks player's score and levels completed.
 * 
 *
 * Must be loaded after global.js and loadLevel.js
 *
 * Requires:
 *     - jQuery         [http://jquery.com/]
 */

(function() {

// Level and score tracking
var
    unplayedLevels,
    currentLevel    = 0,
    totalScore      = 0;

// Level complete modal DOM elements
var
    levelCompleteModal,
    nextLevelButton,
    randomLevelButton,
    submitScoreButton,
    playerNameInput;

// ----------------------------------------------------------
//               P U B L I C   F U N C T I O N S
// ----------------------------------------------------------

/**
 * Mark level as complete and add level score to total score.
 */
function addToScore(level, numMoves, secondsTaken) {
    if (!unplayedLevels) {
        initializeUnplayedLevels();
    }

    currentLevel = parseInt(level);
    totalScore += calculateScore(level, numMoves, secondsTaken);

    markLevelComplete(currentLevel);

    console.log(unplayedLevels);
    console.log('lvl: ' + currentLevel + ', difficulty: ' + difficulty + ', moves: ' + numMoves + ', sec: ' + secondsTaken + ', score: ' + totalScore);
}

/**
 * Submit score to leaderboard.
 */
function submitScore() {
    var submitScoreURL = AJAX_URL.SUBMIT_SCORE + '?name=' + getPlayerName() + '&score=' + totalScore;
    sr.ajaxGet(submitScoreURL, redirectToLeaderboard);

    // Temporary.
    // Allows redirecting to leaderboard when submitting scores locally.
    setTimeout(redirectToLeaderboard, 1000);
}

/**
 * Checks if there is an unplayed level.
 */
function hasNextUnplayedLevel() {
    return unplayedLevels.length > 0;
}

/**
 * Gets next unplayed level.
 */
function getNextUnplayedLevel() {
    return (hasNextUnplayedLevel()) ? unplayedLevels[0] : -1;
}

/**
 * Get a random unplayed level.
 */
function getRandomUnplayedLevel() {
    var randomIndex = Math.floor(Math.random() * unplayedLevels.length);
    return unplayedLevels[randomIndex];
}

// Attach public functions to global sr object
window.sr.addToScore             = addToScore;
window.sr.submitScore            = submitScore;
window.sr.hasNextUnplayedLevel   = hasNextUnplayedLevel;
window.sr.getNextUnplayedLevel   = getNextUnplayedLevel;
window.sr.getRandomUnplayedLevel = getRandomUnplayedLevel;

// ----------------------------------------------------------
//               C O R E   F U N C T I O N S
// ----------------------------------------------------------

/**
 * Calculates score for current level.
 */
function calculateScore(level, numMoves, secondsTaken) {
    var difficulty      = parseInt((level / 10) + 1);
    var difficultyScore = SCORING.DIFFICULTY_MULTIPLIER * difficulty;
    var movesMultiplier = Math.pow(SCORING.MOVES_MULTIPLIER, numMoves);
    var timeMultiplier  = Math.pow(SCORING.SECONDS_MULTIPLIER, secondsTaken);

    return difficultyScore * movesMultiplier * timeMultiplier;
}

// ----------------------------------------------------------
//            H E L P E R   F U N C T I O N S
// ----------------------------------------------------------

/**
 * Initialize level variables.
 */
function initializeUnplayedLevels() {
    unplayedLevels = [];

    for (var i = 0; i < TOTAL_LEVELS; i++) {
        var level = i + 1;
        unplayedLevels[i] = level;
    }
}

/**
 * Remove level from the list of unplayedLevels.
 */
function markLevelComplete(level) {
    for (var i = 0; i < unplayedLevels.length; i++) {
        if (unplayedLevels[i] == level) {
            unplayedLevels.splice(i, 1);
        }
    }
}

/**
 * Shows submit score response.
 */
function redirectToLeaderboard() {
    window.location.href = AJAX_URL.LEADERBOARD;
}

/**
 * Get player name from input element.
 */
function getPlayerName() {
    return encodeURIComponent(PLAYER_NAME_INPUT.val());
}

})();
