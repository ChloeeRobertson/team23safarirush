/*
 * animal.js for Safari Rush
 * http://team23.site88.net
 *
 */

(function(_window) {

var

    // Returns new animal object or false if invalid parameters or position
    newAnimal = function(row, col, w, h, grid) {

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

        // Return new animal
        return new animal(row, col, w, h, grid);
    },

    // Return array of row-col pairs for an animal
    getCells = function(row, col, w, h) {
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

            cells.push([r, c]);
        }

        return cells;
    },

    // Reference to error function
    error = _window.sr.error,

    // Reference to other useful functions
    isInt = Number.isInteger;

var animal = function(row, col, wSpan, hSpan, gameGrid) {

    var

        // Default Column, Row, Width Span, Height Span (respectively)
        x = col,
        y = row,
        w = wSpan,
        h = hSpan,

        // Array storing cells of animal in row-col pairs
        cells = getCells(row, col, wSpan, hSpan),

        // Grid object that animal is in
        grid = gameGrid,

        // Can move horizontally
        xMovable = (w > 1),

        // Can move vertically
        yMovable = (h > 1),

        // Initiates new animal
        init = function() {
            this.fillGrid();
        };

    // Move animal
    // (movement = 1, -1)
    this.move = function(movement) {
        if (!this.canMove(movement)) {
            console.log("ERROR: Can't make invalid move.");
            return false;
        }

        // unfill cells occupied by current animal position
        if (!this.unfillGrid()) {
            return false;
        }

        // set new animal position
        if (this.xMovable) {
            this.x += +movement;
        } else {
            this.y += +movement;
        }

        // fill cells with new position
        this.fillGrid();
    };

    // Can animal make this move?
    // (movement = 1, -1)
    this.canMove = function(movement) {
        if (movement != 1 && movement != -1) {
            console.log("ERROR: Invalid animal movement. " + movement);
            return false;
        }

        var max = (this.yMovable) ? this.h : this.w;
        var row = (this.yMovable) ? this.y + movement : this.y;
        var col = (this.xMovable) ? this.x + movement : this.x;

        for (var count = 0; count < max; count++) {
            // Determine movement axis (x or y)
            if (this.yMovable) {
                row = this.y + +movement + count;
            } else {
                col = this.x + +movement + count;
            }

            // Cell not empty and not occupied by this animal
            if (!this.grid.cellEmpty(row, col) && !this.occupyingCell(row, col)) {
                return false;
            }
        }

        return true;
    };

    // Animal currently occupying this cell?
    this.occupyingCell = function(row, col) {
        return  y <= row && row <= (y + h - 1) &&
                x <= col && col <= (x + w - 1);
    };

    // Fill current positions on grid
    this.fillGrid = function() {

        if (!grid.cellsEmpty(cells) || grid.cellsEmpty()) {}

        var max = (this.yMovable) ? this.h : this.w;
        var row = this.y;
        var col = this.x;

        for (var count = 0; count < max; count++) {
            // Determine movement axis (x or y)
            if (this.yMovable) {
                row = this.y + count;
            } else {
                col = this.x + count;
            }

            if (unfill) {
                if (!this.grid.unfillCell(row, col)) {
                    return false;
                }
            } else if (this.grid.cellEmpty(row, col)) {
                if (!this.grid.fillCell(row, col)) {
                    return false;
                }
            } else {
                console.log("ERROR: Animal occupying non-empty or out-of-bound cell. " + row + ", " + col);
                return false;
            }
        }

        return true;
    };

    // Unfill current positions on grid
    this.unfillGrid = function() {
        return this.fillGrid(true);
    };

    // Initiate new animal
    init();
};

// Register global variable
_window.newAnimal = newAnimal;

})(window);
