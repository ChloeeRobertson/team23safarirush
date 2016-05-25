/*
 * Level selector.
 *
 * Must be loaded after global.js and loadLevel.js
 *
 * Requires:
 *     - jQuery         [http://jquery.com/]
 *     - ItemSlide      [https://itemslide.github.io/]
 */

(function(global) {

var
    LOCKED_ICON     = 'glyphicon-lock',
    UNLOCKED_ICON   = 'glyphicon-triangle-top';

var
    locked          = false,    // Disables/locks level selection (once first move is made in level)
    currentLevel    = 0,        // Current level player is on
    list            = [];       // List of all levels (DOM elements) in level selector

// ----------------------------------------------------------
//               P U B L I C   F U N C T I O N S
// ----------------------------------------------------------

/**
 * Initialize level selector
 */
function initialize() {
    initializeButtons();
    createLevelsList();
    setSelectorDimensions();
}

/**
 * Shows the level selector modal if it's not locked.
 *
 * If selectedLevel is set, shows selectedLevel for x amount of time
 * before rotating to show current level.
 */
function show(selectedLevel) {

    // Don't show, it's locked (already made first move)
    if (locked) {
        alert('You need to complete current level before selecting another level.');
        return;
    }

    var showCurrentLevelDelay = selectedLevel ?
        LEVEL_SELECTOR_DELAY.ANIMATE_TO_LEVEL + LEVEL_SELECTOR_DELAY.SHOW_COMPLETED_LEVEL_FOR :
        LEVEL_SELECTOR_DELAY.ANIMATE_TO_LEVEL;

    LEVEL_SELECTOR_MODAL.modal('show');

    // Show selected level for a while
    // must be delayed due to bootstrap modal loading time
    if (selectedLevel) {
        setTimeout(function() {
            slideTo(selectedLevel);
        }, LEVEL_SELECTOR_DELAY.ANIMATE_TO_LEVEL);
    }

    // Automatically go to current level after a delay (enough time to show selectedLevel)
    setTimeout(function() {
        slideTo(currentLevel);
    }, showCurrentLevelDelay);
}

/**
 * Returns current level.
 */
function getCurrentLevel() {
    return currentLevel;
}

/**
 * Adds achievement icon.
 */
function addAchievement(achievementNum) {
    ACHIEVEMENTS.append('<img src="' + ACHIEVEMENT_ICONS[achievementNum] + '">');
}

/**
 * Updates current level display on level selector button.
 */
function setLevel(level) {
    currentLevel = level;
    var difficulty = getLevelDifficulty(level);

    LEVEL_SELECTOR_BUTTON.children('.selectorButtonDifficulty').text(difficulty);
    LEVEL_SELECTOR_BUTTON.children('.selectorButtonLevel').text(currentLevel);
}

/**
 * Set level statistics comparing current player vs other players.
 */
function setCompleted(level, assessment) {

    // Update score
    SCORE_DISPLAY.text(Tracker.getScore());

    // Create DOM elements to show statistics and score
    var item = $(list.children()[level - 1]);
    var itemStats = $('<div class="completedStats"></div>');
    var itemStatsHtml  = '<span class="averageScore">' + assessment.grade + '</span>';
        itemStatsHtml += '<span>' + assessment.numMoves + '</span> moves in<br>';
        itemStatsHtml += '<span>' + formatTimeFromSeconds(assessment.secondsTaken) + '</span>';

    // Append to HTML DOM
    item.addClass('levelCompleted');
    itemStats.appendTo(item);
    itemStats.html(itemStatsHtml);
}

/**
 * Go to a level in level selector screen.
 */
function slideTo(level) {
    list.gotoSlide(level - 1);
}

/**
 * Lock level selector.
 */
function lock() {
    locked = true;
    LEVEL_SELECTOR_BUTTON.children('.glyphicon').addClass(LOCKED_ICON).removeClass(UNLOCKED_ICON);
}

/**
 * Unlock level selector.
 */
function unlock() {
    locked = false;
    LEVEL_SELECTOR_BUTTON.children('.glyphicon').addClass(UNLOCKED_ICON).removeClass(LOCKED_ICON);
}

// Make public functions go public
global.LevelSelector = {
    initialize:         initialize,
    show:               show,
    getCurrentLevel:    getCurrentLevel,
    addAchievement:     addAchievement,
    setLevel:           setLevel,
    setCompleted:       setCompleted,
    slideTo:            slideTo,
    lock:               lock,
    unlock:             unlock
};

// ----------------------------------------------------------
//               C O R E   F U N C T I O N S
// ----------------------------------------------------------

/**
 * Use javascript to generate a DOM element for each level.
 */
function createLevelsList() {
    
    // Create list structure for ItemSlide
    list = $('<ul></ul>');
    list.appendTo(LEVEL_SELECTOR_CONTAINER);

    for (var i = 0; i < TOTAL_LEVELS; i++) {
        var level          = i + 1;
        var item           = $('<li></li>');
        var itemDifficulty = $('<div class="levelDifficulty">' + getLevelDifficulty(level) + '</div>');
        var itemLevelNum   = $('<div class="levelNum">' + level + '</div>');
        var itemPlayBtn    = $('<div class="btn btn-success playButton">PLAY</div>');

        activatePlayButtonForLevel(level, itemPlayBtn);

        // Append to the DOM
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
function setSelectorDimensions() {
    var containerHeight = global.innerHeight / 2;
    var listWidth       = list.children(':first').width() * TOTAL_LEVELS;

    LEVEL_SELECTOR_CONTAINER.height(containerHeight);
    list.width(listWidth);
}

/**
 * Load level selector button and add event listeners to
 * random level and score submit buttons.
 */
function initializeButtons() {
    LEVEL_SELECTOR_BUTTON.html(
        '<span class="selectorButtonDifficulty"></span> - ' +
        '<span class="selectorButtonLevel"></span> ' +
        '<span class="glyphicon"></span>'
    );

    LEVEL_SELECTOR_BUTTON.on('click', function() {
        show();
    });

    RANDOM_LEVEL_BUTTON.on('click', function() {
        slideTo(Tracker.getRandomUnplayedLevel());
    });

    SUBMIT_SCORE_BUTTON.on('click', function() {
        Tracker.submitScore();
    });
}

/**
 * Converts seconds into time format: (00:00) minutes : seconds.
 */
function formatTimeFromSeconds(totalSeconds) {
    var minutes = prependZeroIfOneDigit(Math.floor(totalSeconds / 60));
    var seconds = prependZeroIfOneDigit(totalSeconds % 60);
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
function activatePlayButtonForLevel(level, playButton) {
    playButton.on('click', function() {
        Board.loadLevel(level);
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
