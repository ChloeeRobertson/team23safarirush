/*
 * animal.js for Safari Rush
 * http://team23.site88.net
 *
 */

// Runs in self-invoking anonymous function to
// hide variables from global space
(function(_window) {

var newAnimal = function(row, col, w, h, grid) {

    // ----------------------------------------------
    // Parameter error checking
    
    // Non-integer position or dimension
    if (!isInt(row) || !isInt(col) || !isInt(w) || !isInt(h)) {
        return error(
            "Can't initiate animal. Animal position or dimension not integer. "
            + 'row: ' + row + ', col: ' + col + ', h: ' + h + ", w: " + w
        );
    }

    // Incorrect animal dimension
    if (w == h || w < 1 || h < 1 || (w != 1 && h != 1)) {
        return error('Incorrect animal dimension. w: ' + w + ', h: ' + h);
    }

    // Invalid grid
    if (typeof grid !== 'object' || typeof grid.cellExists === 'undefined') {
        return error('Invalid game grid for animal.');
    }

    // Non-empty or out-of-bound position
    var cells = getCells(row, col, w, h);
    if (!grid.cellsEmpty(cells)) {
        return error('Animal position not-empty or out-of-bound. ' + cells);
    }

    // ----------------------------------------------
    // Private data
    
    var

        // Default Column, Row, Width Span, Height Span (respectively)
        x = col,
        y = row,
        // w = w,   // Commented out cause already in parameter
        // h = h,   // Commented out cause already in parameter

        // Array storing cells of animal in row-col pairs
        cells = getCells(row, col, w, h),

        // Grid object that animal is in
        // Commented out cause already in parameter
        // grid = gameGrid,

        // Can move horizontally
        xMovable = (w > 1),

        // Can move vertically
        yMovable = (h > 1),

        // Initiates new animal
        init = function() {
            grid.fillCells(cells);
        };

    // ----------------------------------------------
    // Initiate new animal
    
    init();

    // ----------------------------------------------
    // Public data
    
    return {

        // Move animal
        move: function (movement) {
            if (this.canMove(movement) && this.unfillGrid()) {
                if (xMovable) {
                    // Changes global var
                    x += movement;
                } else {
                    // Changes global var
                    y += movement;
                }

                return this.fillGrid();
            }

            return false;
        },

        // Can animal make this move?
        canMove: function (movement) {
            if (VALIDMOVE.indexOf(movement) > -1) {
                if (xMovable) {
                    // Changes local var, global x unaffected
                    var x = x + movement;
                } else {
                    // Changes local var, global y unaffected
                    var y = y + movement;
                }

                return grid.cellsEmpty(getCells(row, col, x, y, cells));
            }

            return false;
        },

        // Fill current positions on grid
        fillGrid: function () {
            return grid.cellsEmpty(cells) ?
                grid.fillCells(cells) : false;
        },

        // Unfill current positions on grid
        unfillGrid: function () {
            return grid.unfillCells(cells);
        }
    }
};

// ----------------------------------------------
// Shared across all animals (think static)

var

    // Valid positive and negative movements for animal
    VALIDMOVE = [1, -1],

    // Return array of cells occupied by an animal
    // ( e.g. [[0,0], [0,1]] = row 0, col 0 && row 0, col 1)
    getCells = function(row, col, w, h, ignoreCells) {
        var portrait = (h > w);
        var max = Math.max(w, h);
        var r = row;
        var c = col;
        var cells = [];

        for(var count = 0; count < max; count++) {
            if (portrait) {
                r = row + count;
            } else {
                c = col + count;
            }

            if ((ignoreCells && !inCells(ignoreCells)) || !ignoreCells) {
                cells.push([r, c]);
            }
        }

        return cells;
    },

    // Determine if a specific cell exists inside an array of cells
    inCells = function(row, col, cells) {
        return cells.some(function(elem) {
            return elem[0] == row && elem[1] == col;
        });
    },

    // Reference to error function
    error = _window.sr.error,

    // Reference to other useful functions
    isInt = Number.isInteger;

// ----------------------------------------------

// Register global variable
_window.newAnimal = newAnimal;

})(window);
