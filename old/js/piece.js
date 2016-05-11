/*
 * piece.js for Safari Rush
 * http://team23.site88.net
 *
 */

// Runs in self-invoking anonymous function to
// hide variables from global space
(function(_window) {

var newPiece = function(x, y, w, h, grid, id, isJeep, callback) {

    // ----------------------------------------------
    // PARAMETER ERROR CHECKING
    // ----------------------------------------------

    // Non-integer position or dimension
    if (!isInt(x) || !isInt(y) || !isInt(w) || !isInt(h) || !isInt(id)) {
        return sr.error(
            "Can't initiate piece. Piece position, id, or dimension not integer. "
            + 'x: ' + x + ', y: ' + y + ', h: ' + h + ", w: " + w + ", id: " + id
        );
    }

    // Incorrect piece dimension or id
    if (id < 0 || w == h || w < 1 || h < 1 || (w != 1 && h != 1)) {
        return sr.error(
            'Incorrect piece dimension or ID. w: '
            + w + ', h: ' + h + ', id: ' + id
        );
    }

    // Invalid grid
    if (typeof grid !== 'object' || typeof grid.cellExists === 'undefined') {
        return sr.error('Invalid game grid for piece.');
    }

    // Non-empty or out-of-bound position
    var cells = getCells(x, y, w, h);
    if (!grid.cellsEmpty(cells)) {
        return sr.error('Piece position not-empty or out-of-bound. ' + cells);
    }

    // Callback is not a function
    if (typeof callback !== 'function') {
        return sr.error('Callback for image loading missing.');
    }

    // ----------------------------------------------
    // PRIVATE DATA
    // ----------------------------------------------
    
    var
        // Array storing cells of piece in x-y pairs
        cells = getCells(x, y, w, h),

        // Can move horizontally
        xMovable = (w > 1),

        // Can move vertically
        yMovable = (h > 1),

        // X & Y coordinates in px
        xCoord = 0,
        yCoord = 0,

        // # of images loaded
        imagesLoaded = 0,

        imgUrl = isJeep ? 'images/animals/fox.jpg' : 'images/animals/elephant.jpg';

        // Increment # of images loaded
        addImageCount = function() {
            imagesLoaded++;

            if (imagesLoaded === images.length) {
                callback(id);
            }
        },

        // Collection of images
        images = [loadImage(imgUrl, addImageCount)];

    // ----------------------------------------------
    // INITIALIZATION
    // ----------------------------------------------
    
    // Fill grid cells occupied by piece
    grid.fillCells(cells, id);

    // ----------------------------------------------
    // PUBLIC DATA
    // ----------------------------------------------
    
    return {

        // Draw piece onto grid based on current position
        draw: function() {
            grid.drawPiece(images[0], x, y, w, h);
        },

        undraw: function() {
            grid.undrawPiece(x, y, w, h);
        },

        // Can move piece horizontally?
        canMoveX: function() {
            return xMovable;
        },

        // Can move piece horizontally?
        canMoveY: function() {
            return yMovable;
        },

        // Can piece make this move?
        canMove: function (movement) {
            var newX = xMovable ? movement : x;
            var newY = yMovable ? movement : y;

            // console.log(getCells(newX, newY, w, h, cells));
            return grid.cellsEmpty(getCells(newX, newY, w, h, cells, id));
        },

        // Move piece
        move: function (movement) {
            if (this.canMove(movement) && this.unfillGrid()) {

                this.undraw();

                if (xMovable) {
                    // Changes global var
                    x = movement;
                } else {
                    // Changes global var
                    y = movement;
                }

                this.draw();
                return this.fillGrid();
            }

            return false;
        },

        // Fill current positions on grid
        fillGrid: function () {
            return grid.cellsEmpty(cells) ?
                grid.fillCells(cells, id) : false;
        },

        // Unfill current positions on grid
        unfillGrid: function () {
            return grid.unfillCells(cells);
        }
    }
};

// ----------------------------------------------
// SHARED DATA
// ----------------------------------------------

var
    // Valid positive and negative movements for piece
    VALIDMOVE = [sr.YAY, sr.NAY],

    loadImage = function(imgUrl, callback) {
        var img = new Image();
        img.src = imgUrl;

        img.onload = callback;

        return img;
    },

    // Return array of cells occupied by an piece
    // ( e.g. [row,col] : coordinates [[0,0], [0,1]])
    getCells = function(x, y, w, h, ignoreCells, id) {
        var col = x;
        var row = y;
        var cells = [];

        for(var count = 0; count < Math.max(w, h); count++) {
            if (h > w) {
                row = y + count;
            } else {
                col = x + count;
            }

            if ((ignoreCells && !inCells(x, y, ignoreCells)) || !ignoreCells) {
                cells.push([row, col]);
            }
        }

        if (id && id == 8) {
            console.log(cells);
        }

        return cells;
    },

    // Determine if a specific cell exists inside an array of cells
    inCells = function(x, y, cells) {
        return cells.some(function(elem) {
            return elem[0] == y && elem[1] == x;
        });
    },

    // Reference to other useful functions
    isInt = Number.isInteger;

// ----------------------------------------------
// MISCELLANEOUS
// ----------------------------------------------

// Register global variable
_window.newPiece = newPiece;

})(window);
