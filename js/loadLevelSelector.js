(function(global) {

var
    locked = false, // Locks level selection (once first move is made in level)
    currentLevel,   // Current level player is on
    list;           // List of all levels (DOM elements)

// ----------------------------------------------------------
//               P U B L I C   F U N C T I O N S
// ----------------------------------------------------------

/**
 * Load level selector.
 */
function loadLevelSelector() {
    createLevelItems();
    setResponsiveDimensions();
    initiateButtons();
}

/**
 * Shows the level selector modal if it's not locked.
 *
 * If selectedLevel is set, shows selectedLevel for x amount of time
 * before rotating to show current level.
 */
function showLevelSelector(selectedLevel) {

    // Don't show, it's locked (already made first move)
    if (locked) {
        alert('You need to complete current level before selecting another level.');
        return;
    }

    var showCurrentLevelDelay = selectedLevel ?
        LEVEL_SELECTOR_DELAY.ANIMATE_TO_LEVEL + LEVEL_SELECTOR_DELAY.SHOW_COMPLETED_LEVEL_FOR :
        LEVEL_SELECTOR_DELAY.ANIMATE_TO_LEVEL;

    LEVEL_SELECTOR_MODAL.modal('show');

    // Show selected level for a while (delayed due to bootstrap modal loading time)
    if (selectedLevel) {
        setTimeout(function() {
            levelSelectorGoTo(selectedLevel);
        }, LEVEL_SELECTOR_DELAY.ANIMATE_TO_LEVEL);
    }

    // Automatically go to current level after a delay (enough time to show selectedLevel)
    setTimeout(function() {
        levelSelectorGoTo(currentLevel);
    }, showCurrentLevelDelay);
}

/**
 * Updates current level display on level selector button.
 */
function updateLevelSelector(level, isLocked) {
    currentLevel = level;
    var difficulty = getLevelDifficulty(level);
    var icon = isLocked ? 'glyphicon-lock' : 'glyphicon-triangle-top';

    LEVEL_SELECTOR_BUTTON.html(
        difficulty + ' - ' + level +
        ' <span class="glyphicon ' + icon + '"></span>'
    );
}

/**
 * Go to a level in level selector screen.
 */
function levelSelectorGoTo(level) {
    list.gotoSlide(level - 1);
}

/**
 * Lock level selector once game starts.
 */
function lockLevelSelector() {
    locked = true;
    updateLevelSelector(currentLevel, locked);
}

/**
 * Gray-out completed level so user can't replay it.
 */
function markLevelCompleteInSelector(level, numMoves, secondsTaken, averageComparison) {
    var average;
    if (averageComparison > 0) {
        average = 'Above Average';
    } else if (averageComparison < 0) {
        average = 'Below Average';
    } else {
        average = 'Just Another Potato';
    }

    var item = $(list.children()[level - 1]);
    var itemStats = $('<div class="completedStats"></div>');
    var itemStatsHtml  = '<span class="averageScore">' + average + '</span>';
        itemStatsHtml += '<span>' + numMoves + '</span> moves in<br>';
        itemStatsHtml += '<span>' + formatTimeFromSeconds(secondsTaken) + '</span>';

    item.addClass('levelCompleted');
    itemStats.appendTo(item);
    itemStats.html(itemStatsHtml);

    locked = false;
}

global.sr.loadLevelSelector           = loadLevelSelector;
global.sr.showLevelSelector           = showLevelSelector;
global.sr.updateLevelSelector         = updateLevelSelector;
global.sr.levelSelectorGoTo           = levelSelectorGoTo;
global.sr.lockLevelSelector           = lockLevelSelector;
global.sr.markLevelCompleteInSelector = markLevelCompleteInSelector;

// ----------------------------------------------------------
//               C O R E   F U N C T I O N S
// ----------------------------------------------------------

/**
 * Use javascript to generate a DOM element for each level.
 */
function createLevelItems() {
    list = $('<ul></ul>');
    list.appendTo(LEVEL_SELECTOR_CONTAINER);

    for (var i = 0; i < TOTAL_LEVELS; i++) {
        var level          = i + 1;
        var item           = $('<li></li>');
        var itemDifficulty = $('<div class="levelDifficulty">' + getLevelDifficulty(level) + '</div>');
        var itemLevelNum   = $('<div class="levelNum">' + level + '</div>');
        var itemPlayBtn    = $('<div class="btn btn-success playButton">PLAY</div>');

        activatePlayButton(level, itemPlayBtn);

        item.appendTo(list);
        itemDifficulty.appendTo(item);
        itemLevelNum.appendTo(item);
        itemPlayBtn.appendTo(item);
    }

    // Activate jQuery ItemSlide.js
    list.itemslide();
}

// ----------------------------------------------------------
//            H E L P E R   F U N C T I O N S
// ----------------------------------------------------------

/**
 * Sets responsive width and heights for selector DOM elements.
 */
function setResponsiveDimensions() {
    var containerHeight = global.innerHeight / 2;
    var listWidth       = list.children(':first').width() * TOTAL_LEVELS;

    LEVEL_SELECTOR_CONTAINER.height(containerHeight);
    list.width(listWidth);
}

/**
 * Add event listeners to random level and score submit buttons.
 */
function initiateButtons() {
    RANDOM_LEVEL_BUTTON.on('click touchend', function() {
        var level = sr.getRandomUnplayedLevel();
        levelSelectorGoTo(level);
    });

    SUBMIT_SCORE_BUTTON.on('click touchend', function() {
        sr.submitScore();
        // hideSelectorModal();
    });
}

/**
 * Converts seconds into time format: (00:00) minutes : seconds.
 */
function formatTimeFromSeconds(seconds) {
    var minutes = prependZeroIfOneDigit(Math.floor(seconds / 60));
    var seconds = prependZeroIfOneDigit(seconds % 60);
    return minutes + ':' + seconds;
}

/**
 * Adds a leading zero if digit is less than 10. (Used in formatTimeFromSeconds())
 */
function prependZeroIfOneDigit(number) {
    return (number < 10) ? '0' + number : number;
}

/**
 * Add event listener to load level when clicking/tapping playButton.
 */
function activatePlayButton(level, playButton) {
    playButton.on('click', function() {
        sr.loadLevel(level);
        hideSelectorModal();
    });
}

/**
 * Hide selector modal.
 */
function hideSelectorModal() {
    LEVEL_SELECTOR_MODAL.modal('hide');
}

/**
 * Returns the difficulty of level.
 * e.g.      level <= 10, then difficulty = 1
 *      10 < level <= 20,      difficulty = 2 ...
 */
function getLevelDifficulty(level) {
    var difficultyNum = Math.floor((level - 1) / 10);
    return LEVEL_DIFFICULTY[difficultyNum];
}

})(window);
