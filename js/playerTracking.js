/*
 * Tracks player's score and levels completed.
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
        initializeLevels();
        initializeButtons();
    }

    currentLevel = parseInt(level);
    totalScore += calculateScore(level, numMoves, secondsTaken);

    markLevelComplete(currentLevel);

    console.log(unplayedLevels);
    console.log('lvl: ' + currentLevel + ', difficulty: ' + difficulty + ', moves: ' + numMoves + ', sec: ' + secondsTaken + ', score: ' + totalScore);
}

/**
 * Show level complete modal.
 */
function showLevelCompleteModal() {
    if (!hasNextLevel()) {
        nextLevelButton.hide();
        randomLevelButton.hide();
    }

    levelCompleteModal.modal('show');
}

// Attach public functions to global sr object
window.sr.addToScore             = addToScore;
window.sr.showLevelCompleteModal = showLevelCompleteModal;

// ----------------------------------------------------------
//               C O R E   F U N C T I O N S
// ----------------------------------------------------------

/**
 * Checks if there is an unplayed level.
 */
function hasNextLevel() {
    return unplayedLevels.length > 0;
}

/**
 * Gets next unplayed level.
 */
function getNextLevel() {
    return (hasNextLevel()) ? unplayedLevels[0] : -1;
}

/**
 * Get a random unplayed level.
 */
function getRandomLevel() {
    var randomIndex = Math.floor(Math.random() * unplayedLevels.length);
    return unplayedLevels[randomIndex];
}

/**
 * Submit score to leaderboard.
 */
function submitScore() {
    var submitScoreURL = AJAX_URL.SUBMIT_SCORE + '?name=' + getPlayerName() + '&score=' + totalScore;
    sr.ajaxGet(submitScoreURL, showSubmitScoreResults);
}

/**
 * Shows submit score response.
 */
function showSubmitScoreResults(ajaxResponse) {
    console.log(ajaxResponse);
}

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
function initializeLevels() {
    unplayedLevels = [];

    for (var i = 0; i < TOTAL_LEVELS; i++) {
        var level = i + 1;
        unplayedLevels[i] = level;
    }
}

/**
 * Set up level complete modal buttons.
 */
function initializeButtons() {
    levelCompleteModal = $('#' + DIV_ID.LEVEL_COMPLETE_MODAL);
    nextLevelButton    = $('#' + DIV_ID.NEXT_LEVEL_BUTTON);
    randomLevelButton  = $('#' + DIV_ID.RANDOM_LEVEL_BUTTON);
    submitScoreButton  = $('#' + DIV_ID.SUBMIT_SCORE_BUTTON);
    playerNameInput    = $('#' + DIV_ID.PLAYER_NAME_INPUT);

    nextLevelButton.on('click touchstart', function() {
        sr.loadLevel(getNextLevel());
        levelCompleteModal.modal('hide');
    });

    randomLevelButton.on('click touchstart', function() {
        sr.loadLevel(getRandomLevel());
        levelCompleteModal.modal('hide');
    });

    submitScoreButton.on('click touchstart', function() {
        submitScore();
        window.location.href = AJAX_URL.LEADERBOARD;
    });
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
 * Get player name from input element.
 */
function getPlayerName() {
    return encodeURIComponent(playerNameInput.val());
}

})();