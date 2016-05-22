(function(global) {

var
    currentLevel, // Current level player is on
    list;         // List of all levels (DOM elements)

// ----------------------------------------------------------
//               P U B L I C   F U N C T I O N S
// ----------------------------------------------------------

/**
 * Load's level selector.
 */
function loadLevelSelector() {
    createLevelItems();
    setResponsiveDimensions();
}

/**
 * Shows the level selector modal.
 */
function showLevelSelector() {
    LEVEL_SELECTOR_MODAL.modal('show');

    setTimeout(function() {
        list.gotoSlide(currentLevel - 1);
    }, 1000);
}

/**
 * Updates current level display.
 */
function updateLevelSelector(level) {
    currentLevel = level;
    var difficulty = getLevelDifficulty(level);

    LEVEL_SELECTOR_BUTTON.html(
        difficulty + ' - ' + level +
        ' <span class="glyphicon glyphicon-triangle-top"></span>'
    );
}

/**
 * Go to a level in level selector screen.
 */
function levelSelectorGoTo(level) {
    list.gotoSlide(level - 1);
}

/**
 * Gray-out completed level so user can't replay it.
 */
function markLevelCompleteInSelector(level) {
    var item = $(list.children()[level - 1]);
    item.addClass('levelCompleted');
}

global.sr.loadLevelSelector           = loadLevelSelector;
global.sr.showLevelSelector           = showLevelSelector;
global.sr.updateLevelSelector         = updateLevelSelector;
global.sr.levelSelectorGoTo           = levelSelectorGoTo;
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

/**
 * Returns the difficulty of level.
 * e.g.      level <= 10, then difficulty = 1
 *      10 < level <= 20,      difficulty = 2 ...
 */
function getLevelDifficulty(level) {
    var difficultyNum = Math.floor((level - 1) / 10);
    return LEVEL_DIFFICULTY[difficultyNum];
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
 * Add event listener to load level when clicking/tapping playButton.
 */
function activatePlayButton(level, playButton) {
    playButton.on('click', function() {
        sr.loadLevel(level);
        LEVEL_SELECTOR_MODAL.modal('hide');
    });
}

})(window);