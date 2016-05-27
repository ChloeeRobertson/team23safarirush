/*
 * Tracks player's score and levels completed.
 * Determines next unplayed level, random unplayed level if any.
 * Stores and retrieves player's data using cookies.
 *
 * Requires:
 *     - jQuery         [http://jquery.com/]
 *     - JS Cookie      [https://github.com/js-cookie/js-cookie]
 */

(function(global) {

// Cookies
var
    COOKIE_EXPIRY_DAYS = 30,    // Days till cookies expire
    COOKIE_NAME        = 'playerData';

// Grade assignments
var
    ABOVE_AVERAGE      = 'Above Average',
    AVERAGE            = 'Just Another Potato',
    BELOW_AVERAGE      = 'Below Average';

// Achievements & Levels
var
    achievements       = [],    // Tracks any achievements user got
    achievementsShown  = [],    // Tracks achievements that are shown on level selector

    unplayedLevels     = [],    // Tracks all levels unplayed
    lastCompletedLevel = 0;     // Last completed level

// Score tracking
var
    numMoves           = [],    // Tracks number of moves per level
    secondsUsed        = [],    // Tracks seconds used per level
    averageNumMoves    = [],    // Average number of moves per level (from DB)
    averageSecondsUsed = [],    // Average seconds used per level (from DB)
    levelScore         = [],    // Tracks score per level

    totalScore         = 0;     // Total score, used for leaderboard ranking

// ----------------------------------------------------------
//               P U B L I C   F U N C T I O N S
// ----------------------------------------------------------

/**
 * Initialize variables.
 */
function initialize() {
    numMoves       = [];
    secondsUsed    = [];
    levelScore     = [];
    unplayedLevels = [];

    for (var i = 0; i < TOTAL_LEVELS; i++) {
        var level             = i + 1;
        numMoves[level]       = 0;
        secondsUsed[level]    = 0;
        levelScore[level]     = 0;
        unplayedLevels[i]     = level;
    }

    // Loads averages from database
    var url = AJAX_URL.GET_SCORE_AVERAGES;
    $.ajax(url).always(loadAveragesFromDB);

    // Disable user closing messaging modal
    MESSAGING_MODAL.modal({
        backdrop: 'static',
        keyboard: false,
        show:     false
    });
}

/**
 * Checks if there is an unplayed level.
 */
function hasUnplayedLevel() {
    return unplayedLevels.length > 0; // Index zero is always empty
}

/**
 * Gets next unplayed level.
 */
function getNextUnplayedLevel() {

    if (hasUnplayedLevel()) {

        // Find next unplayed level
        // e.g. completed lvl 10, then find first unplayed lvl > 10
        for (var i in unplayedLevels) {
            if (unplayedLevels[i] > lastCompletedLevel) {
                return unplayedLevels[i];
            }
        }

        // Return first unplayed level
        return unplayedLevels[0];
    }

    // Completed all levels, nothing else to play
    return -1;
}

/**
 * Get a random unplayed level.
 */
function getRandomUnplayedLevel() {
    var randomIndex = Math.floor(Math.random() * unplayedLevels.length);
    return unplayedLevels[randomIndex];
}
    
/**
 * Get current total score.
 */
function getScore() {
    return totalScore;
}
    
/**
 * Submit score to leaderboard.
 */
function submitScore() {

    // Must have non-empty name and score above zero
    if (!getPlayerName() || totalScore <= 0) {
        alert('You must enter your name and have a score above zero to submit your score.');
        return;
    }
    
    Cookies.remove(COOKIE_NAME);

    // Use Ajax to send score
    var url  = AJAX_URL.SUBMIT_SCORE + '?name=' + getPlayerName() + '&totalScore=' + totalScore;
        url += '&achievements=' + getAchievementString();
    $.ajax(url).always(redirectToLeaderboard);
}

/**
 * Mark level as complete and add level score to total score.
 */
function updateCompletedLevel(level, movesTaken, secondsTaken) {
    lastCompletedLevel = level;
    numMoves[level]    = movesTaken;
    secondsUsed[level] = secondsTaken;
    levelScore[level]  = calculateScore(level, movesTaken, secondsTaken);
    totalScore        += levelScore[level];

    removeFromUnplayedLevels(level);

    // Updates level selector with completed level statistics compared to other players
    var assessment = getLevelAssessment(level);
    LevelSelector.setCompleted(level, assessment);

    // Record player's level stats to database
    submitLevelStats(level, movesTaken, secondsTaken);

    // Check if player achieved something
    checkAchievements();

    // Save data
    savePlayerData();
}

/**
 * Determines if there are any saved player data.
 */
function hasPlayerData() {
    var data = Cookies.get(COOKIE_NAME);
    return data ? true : false;
}

/**
 * Load player data from cookies.
 */
function loadPlayerData() {

    if (!hasPlayerData()) {
        return;
    }

    var playerData      = JSON.parse(Cookies.get(COOKIE_NAME));

    achievements        = playerData.achievements;
    unplayedLevels      = playerData.unplayedLevels;

    numMoves            = playerData.numMoves;
    secondsUsed         = playerData.secondsUsed;
    levelScore          = playerData.levelScore;

    totalScore          = playerData.totalScore;
    lastCompletedLevel  = playerData.lastCompletedLevel;

    // Set completed levels in Level Selector
    var setCompletedLevels = function () {
        if (averageNumMoves.length == 0) {
            setTimeout(setCompletedLevels, 250);
        } else {
            for (var level in numMoves) {
                if (numMoves[level]) {
                    var assessment = getLevelAssessment(level);
                    LevelSelector.setCompleted(level, assessment);
                }
            }
        }
    };

    setCompletedLevels();

    var disablePopups = true;

    checkAchievements(disablePopups);

    // Load player's next unplayed level or show game won message
    Mechanics.handleLevelCompletion(disablePopups);
}

/**
 * Pops up a modal to show a message.
 */
function showMessage(htmlMessage, autoCloseAfter) {
    var body = $('#messagingModalMsg');

    body.html(htmlMessage);
    MESSAGING_MODAL.modal('show');

    if (autoCloseAfter) {
        setTimeout(function() {
            hideMessage();
        }, autoCloseAfter * 1000);
    }
}

/**
 * Force hide message modal.
 */
function hideMessage() {
    MESSAGING_MODAL.modal('hide');
}

/**
 * Show game won message.
 */
function showGameWonMessage() {
    var message = '<div style="text-align:center;margin:20px 0;">' +
                  '<img src="images/badges/godBadge.png" style="width: 50%"><br>' +
                  GAMEWON_MESSAGE +
                  "</div>";

    LevelSelector.labelSafariGod();
    BORDER.html(message);
    BORDER.css({background: 'none'});
}

// Make public functions go public
global.Tracker = {
    initialize:             initialize,
    hasUnplayedLevel:       hasUnplayedLevel,
    getNextUnplayedLevel:   getNextUnplayedLevel,
    getRandomUnplayedLevel: getRandomUnplayedLevel,
    getScore:               getScore,
    submitScore:            submitScore,
    updateCompletedLevel:   updateCompletedLevel,
    hasPlayerData:          hasPlayerData,
    loadPlayerData:         loadPlayerData,
    showMessage:            showMessage,
    hideMessage:            hideMessage,
    showGameWonMessage:     showGameWonMessage
};

// ----------------------------------------------------------
//               C O R E   F U N C T I O N S
// ----------------------------------------------------------

/**
 * Save player data to cookies.
 */
function savePlayerData() {
    var playerData = {
        achievements:           achievements,
        unplayedLevels:         unplayedLevels,

        numMoves:               numMoves,
        secondsUsed:            secondsUsed,
        levelScore:             levelScore,

        totalScore:             totalScore,
        lastCompletedLevel:     lastCompletedLevel
    };

    Cookies.set(COOKIE_NAME, playerData, {expires: COOKIE_EXPIRY_DAYS});
}

/**
 * Calculates score for current level.
 */
function calculateScore(level, movesTaken, secondsTaken) {
    var difficulty      = parseInt((level / 10) + 1);
    var difficultyScore = SCORING.DIFFICULTY_MULTIPLIER * difficulty;
    var levelScore      = SCORING.LEVEL_MULTIPLIER * level;

    var movesFactor     = Math.round(movesTaken / (level * SCORING.LEVEL_EASE_FACTOR));
    var timeFactor      = Math.round(secondsTaken / (level * SCORING.LEVEL_EASE_FACTOR));

    var movesMultiplier = Math.pow(SCORING.MOVES_MULTIPLIER, movesFactor);
    var timeMultiplier  = Math.pow(SCORING.SECONDS_MULTIPLIER, timeFactor);

    var score = difficultyScore * levelScore * movesMultiplier * timeMultiplier;
    return Math.round(score);
}

/**
 * Get level assessment.
 */
function getLevelAssessment(level) {
    return {
        numMoves:       numMoves[level],
        secondsTaken:   secondsUsed[level],
        grade:          assessLevel(level)
    };
}

/**
 * Submit level statistics to database.
 */
function submitLevelStats(level, movesTaken, secondsTaken) {
    var url = AJAX_URL.SUBMIT_LEVEL_STATS + '?level=' + level +
        '&numMoves=' + movesTaken + '&secondsUsed=' + secondsTaken;

    $.ajax(url);
}

/**
 * Checks if user achieved anything.
 */
function checkAchievements(disablePopups) {

    // Checks easy, intermediate, advanced, and expert levels completion
    for (var difficulty = 0; difficulty < 4; difficulty++) {
        var from =  1 + (difficulty * 10);
        var to   = 10 + (difficulty * 10);

        if (completedLevels(from, to)) {
            addChievements(difficulty, disablePopups);
        }
    }

    // Checks if user finished all 40 levels
    if (completedLevels(1, 40)) {
        var difficulty = 4;
        addChievements(difficulty, disablePopups);
    }
}

// ----------------------------------------------------------
//            H E L P E R   F U N C T I O N S
// ----------------------------------------------------------

/**
 * Add achievements to tracker and shown on level selector.
 */
function addChievements(difficulty, disablePopups) {
    if (achievements.indexOf(difficulty) < 0) {
        achievements.push(difficulty);
    }

    if (achievementsShown.indexOf(difficulty) < 0) {
        var icon = '<img src="' + ACHIEVEMENT_ICONS[difficulty] + '">';
        var header = ACHIEVEMENT_TITLES[difficulty];
        var description = 'Completed all ' + LEVEL_DIFFICULTY[difficulty] + ' levels.';
        var message = header + '<BR>' + icon + '<BR>' + description;

        achievementsShown.push(difficulty);
        LevelSelector.addAchievement(difficulty);
        
        if (!disablePopups) {
            showMessage(message, ACHIEVEMENT_NOTIFICATION_SHOWN_FOR);
        }
    }
}

/**
 * Gets string representation of achievements to send over AJAX.
 */
function getAchievementString() {
    var string = '';

    for (var i in achievements) {
        var difficulty      = achievements[i];
        var from            = (i <4) ? 1 + (difficulty * 10) : 1;
        var to              = (i < 4) ? 10 + (difficulty * 10) : TOTAL_LEVELS;
        var movesTaken      = 0;
        var secondsTaken    = 0;
        var score           = 0;

        for (var level = from; level <= to; level++) {
            movesTaken      += numMoves[level];
            secondsTaken    += secondsUsed[level];
            score           += levelScore[level];
        }

        string += difficulty + ',' + movesTaken + ',' + secondsTaken + ',' + score + "_";
    }

    // Cut last char off (underline)
    string = string.slice(0, -1);

    return string;
}

/**
 * Checks if user has completed levels from x to y.
 */
function completedLevels(from, to) {
    for (var i in unplayedLevels) {
        if (from <= unplayedLevels[i] && unplayedLevels[i] <= to) {
            return false;
        }
    }

    return true;
}

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
 * Returns: above average (1), average (0), or below average (-1).
 */
function assessLevel(level) {
    var avgNumMovesMin = Math.round(averageNumMoves[level] * (1 - SCORING_COMPARISON_FACTOR.NUM_MOVES));
    var avgNumMovesMax = Math.round(averageNumMoves[level] * (1 + SCORING_COMPARISON_FACTOR.NUM_MOVES));

    var avgSecondsUsedMin = Math.round(averageSecondsUsed[level] * (1 - SCORING_COMPARISON_FACTOR.SECONDS_USED));
    var avgSecondsUsedMax = Math.round(averageSecondsUsed[level] * (1 + SCORING_COMPARISON_FACTOR.SECONDS_USED));

    // Above average score
    if ((numMoves[level] <= avgNumMovesMin && secondsUsed[level] <= avgSecondsUsedMax) ||
        (numMoves[level] <= avgNumMovesMax && secondsUsed[level] <= avgSecondsUsedMin)) {

        return ABOVE_AVERAGE;
    }

    // Below average score
    else if (numMoves[level] > avgNumMovesMax && secondsUsed[level] > avgSecondsUsedMax) {
        
        return BELOW_AVERAGE;
    }

    // Average score
    return AVERAGE;
}

/**
 * Load average scores for each level from database.
 */
function loadAveragesFromDB(results) {

    // Use high # defaults, so it shows players are above-average for most levels
    // Used only when no valid results from database
    var defaultNumMoves    = 99;
    var defaultSecondsUsed = 999;

    // Has results
    if (typeof results === 'string') {

        // Trim whitespace, slice trailing comma, then split into parts
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

    // No results, use defaults
    else {
        for (var level = 1; level <= TOTAL_LEVELS; level++) {
            averageNumMoves[level]    = defaultNumMoves;
            averageSecondsUsed[level] = defaultSecondsUsed;
        }
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
    return encodeURIComponent(PLAYER_NAME_INPUT.val().trim());
}

})(window);
