/*
 * Tracks player's score and levels completed.
 * Determines next unplayed level, random unplayed level if any.
 *
 * Must be loaded after global.js and loadLevel.js
 *
 * Requires:
 *     - jQuery         [http://jquery.com/]
 */

(function() {

// Level tracking
var
    unplayedLevels     = [],
    currentLevel       = 0;

// Score tracking
var
    numMoves           = [],    // Tracks number of moves per level
    secondsUsed        = [],    // Tracks seconds used per level
    averageNumMoves    = [],    // Average number of moves per level (from DB)
    averageSecondsUsed = [],    // Average seconds used per level (from DB)

    totalScore         = 0,
    scoreSubmitted     = false; // Prevents double score submissions

// ----------------------------------------------------------
//               P U B L I C   F U N C T I O N S
// ----------------------------------------------------------

/**
 * Initialize unplayedLevels and levelScore variables.
 */
function loadTracker() {
    unplayedLevels = [];
    numMoves       = [];
    secondsUsed    = [];

    for (var level = 1; level <= TOTAL_LEVELS; level++) {
        unplayedLevels[level] = level;
        numMoves[level]       = 0;
        secondsUsed[level]    = 0;
    }

    $.ajax({
        url:     AJAX_URL.GET_SCORE_AVERAGES,
        success: loadAveragesFromDB
    });
}

/**
 * Mark level as complete and add level score to total score.
 */
function addToScore(level, movesTaken, secondsTaken) {
    numMoves[level]    = movesTaken;
    secondsUsed[level] = secondsTaken;
    totalScore        += calculateScore(level, movesTaken, secondsTaken);

    removeFromUnplayedLevels(level);

    // Updates level selector with completed level statistics compared to other players
    sr.markLevelCompleteInSelector(level, movesTaken, secondsTaken, getAverageComparisonNum(level));

    // Record player's level stats to database
    submitLevelStats(level, movesTaken, secondsTaken);
}

/**
 * Submit score to leaderboard.
 */
function submitScore() {

    // Prevents double submission of score
    if (scoreSubmitted) {
        return;
    }
    scoreSubmitted = true;

    // Use Ajax to send score
    $.ajax({
        url:     AJAX_URL.SUBMIT_SCORE + '?name=' + getPlayerName() + '&totalScore=totalScore',
        success: redirectToLeaderboard
    });
}

/**
 * Checks if there is an unplayed level.
 */
function hasNextUnplayedLevel() {
    return unplayedLevels.length > 1; // Index zero is always empty
}

/**
 * Gets next unplayed level.
 */
function getNextUnplayedLevel() {
    return (hasNextUnplayedLevel()) ? unplayedLevels[1] : -1; // Index zero is always empty
}

/**
 * Get a random unplayed level.
 */
function getRandomUnplayedLevel() {
    var randomIndex = Math.floor(Math.random() * unplayedLevels.length);
    return unplayedLevels[randomIndex];
}

// Attach public functions to global sr object
window.sr.loadTracker              = loadTracker;
window.sr.addToScore               = addToScore;
window.sr.submitScore              = submitScore;
window.sr.hasNextUnplayedLevel     = hasNextUnplayedLevel;
window.sr.getNextUnplayedLevel     = getNextUnplayedLevel;
window.sr.getRandomUnplayedLevel   = getRandomUnplayedLevel;

// ----------------------------------------------------------
//               C O R E   F U N C T I O N S
// ----------------------------------------------------------

/**
 * Calculates score for current level.
 */
function calculateScore(level, movesTaken, secondsTaken) {
    var difficulty      = parseInt((level / 10) + 1);
    var difficultyScore = SCORING.DIFFICULTY_MULTIPLIER * difficulty;
    var levelScore      = SCORING.LEVEL_MULTIPLIER * level;
    var movesMultiplier = Math.pow(SCORING.MOVES_MULTIPLIER, movesTaken);
    var timeMultiplier  = Math.pow(SCORING.SECONDS_MULTIPLIER, secondsTaken);

    var score = difficultyScore * levelScore * movesMultiplier * timeMultiplier
    return Math.round(score);
}

/**
 * Submit level statistics to database.
 */
function submitLevelStats(level, movesTaken, secondsTaken) {
    $.ajax({
        url: AJAX_URL.SUBMIT_LEVEL_STATS + '?level=' + level + '&numMoves=' + movesTaken + '&secondsUsed=' + secondsTaken
    });
}

// ----------------------------------------------------------
//            H E L P E R   F U N C T I O N S
// ----------------------------------------------------------

/**
 * Remove level from the list of unplayedLevels.
 */
function removeFromUnplayedLevels(level) {
    for (var i = 0; i < unplayedLevels.length; i++) {
        if (unplayedLevels[i] == level) {
            unplayedLevels.splice(i, 1);
        }
    }
}

/**
 * Calculates whether user's score is:
 * above average (1), average (0), or below average (-1).
 */
function getAverageComparisonNum(level) {
    var avgNumMovesMin = Math.round(averageNumMoves[level] * (1 - SCORING_COMPARISON_FACTOR.NUM_MOVES));
    var avgNumMovesMax = Math.round(averageNumMoves[level] * (1 + SCORING_COMPARISON_FACTOR.NUM_MOVES));

    var avgSecondsUsedMin = Math.round(averageSecondsUsed[level] * (1 - SCORING_COMPARISON_FACTOR.SECONDS_USED));
    var avgSecondsUsedMax = Math.round(averageSecondsUsed[level] * (1 + SCORING_COMPARISON_FACTOR.SECONDS_USED));

    var averageComparison;

    // Below average score
    if (numMoves[level] > avgNumMovesMax && secondsUsed[level] > avgSecondsUsedMax) {
        return -1;
    }

    // Above average score
    else if (numMoves[level] < avgNumMovesMin && secondsUsed[level] < avgSecondsUsedMin) {
        return 1;
    }

    // Average score
    return 0;
}

/**
 * Load average scores for each level from database.
 */
function loadAveragesFromDB(results) {

    // Trim, slice trailing comma, and split into parts
    var levelsAverages = results.trim().slice(0, -1).split("\n");

    for (var i in levelsAverages) {
        var parts          = levelsAverages[i].trim().split(",");
        var level          = parts[0];
        var avgNumMoves    = parts[1];
        var avgSecondsUsed = parts[2];

        averageNumMoves[level]    = avgNumMoves;
        averageSecondsUsed[level] = avgSecondsUsed;
    }
}

/**
 * Shows submit score response.
 */
function redirectToLeaderboard() {
    window.location.href = AJAX_URL.LEADERBOARD + "?score=" + totalScore;
}

/**
 * Get player name from input element.
 */
function getPlayerName() {
    return encodeURIComponent(PLAYER_NAME_INPUT.val());
}

})();
